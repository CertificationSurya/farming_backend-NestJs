import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

// events + variables
import { dbModels, socketEvents } from 'src/constants';
import { MessageObjType, RoomUsersIdType, SeenObjType } from './chat.dto';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';

// types
import { IConversation, IMessage } from 'src/common/dto/chat.dto';
import { User } from 'src/auth/dto/create-user.dto';
import { AllKeySameType } from 'src/common/definations';

const { listenEvents, emitEvents } = socketEvents;
const socketPort = parseInt(process.env.PORT) + 1 || 8081;

@WebSocketGateway(socketPort, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private onlineUser = new Map<string, string>();
  // @WebSocketServer() provides server instance of websocket i.e. 'io' in express
  // any emit from server: Server is emitted to all client
  @WebSocketServer() server: Server;

  constructor(
    @Inject(dbModels.Conversation)
    private conversationModel: Model<IConversation>,
    @Inject(dbModels.User) private userModel: Model<User>,
    @Inject(dbModels.Message) private messageModel: Model<IMessage>,
  ) {
    console.log('socket is running on the port: ' + socketPort);
  }

  private getMongoIdBySocketId(socketId: string) {
    for (const [mongoId, onlineSocketId] of this.onlineUser.entries()) {
      if (onlineSocketId == socketId) {
        return mongoId;
      }
    }
    return null;
  }


  // SOCKET THINGY

  // equivalent to io.on('connection')
  handleConnection(client: Socket) {
    const userMongoId = client.handshake.auth.token;

    // join client in own's room, the room id is user's mongoDb_id
    client.join(userMongoId);
    // for store and emiting online users
    this.onlineUser.set(userMongoId, client.id);

    console.log(`user connected: ${userMongoId} -> mongo, ${client.id} -> socket`);

    this.server.emit(
      emitEvents.ejectOnlineUser,
      Array.from(this.onlineUser.keys()),
    );
  }

  // socket.on event is @SubscribeMessage
  @SubscribeMessage(listenEvents.onMessageSent)
  async handleNewMessage(client: Socket, messageObj: MessageObjType) {
    let isNewConversation = false;
    const { senderId, receiverId, message } = messageObj;

    try {
      // conversation exist
      let conversation = await this.conversationModel.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });

      // no conversation existed before
      if (!conversation) {
        const newConversation = await this.conversationModel.create({
          senderId,
          receiverId,
        });

        conversation = await newConversation.save();
        isNewConversation = true;
      }

      // creating message
      const messageInstance = new this.messageModel({
        text: message,
        senderId,
      });
      const savedMessage = await messageInstance.save();

      // update conversation field with new messageId
      await this.conversationModel.updateOne(
        { _id: conversation._id },
        { $push: { messages: savedMessage._id } },
      );

      // getting client socketid for emiting
      const senderSocketId = this.onlineUser.get(senderId);
      const receiverSocketId = this.onlineUser.get(receiverId);

      const msgAndConvoEmit = async ({
        changableSocketId,
        oppPartySocketId,
      }: AllKeySameType<string>) => {
        this.server
          .to(changableSocketId)
          .emit(emitEvents.ejectReceivedMessage, savedMessage);

        if (isNewConversation) {
          const userData = await this.userModel.find(
            { _id: oppPartySocketId },
            { password: 0 },
          );
          this.server
            .to(changableSocketId)
            .emit(emitEvents.ejectNewConversation, userData);
        }
      };

      if (senderSocketId) {
        await msgAndConvoEmit({
          changableSocketId: senderSocketId,
          oppPartySocketId: receiverId,
        });
      }

      if (receiverSocketId) {
        await msgAndConvoEmit({
          changableSocketId: receiverSocketId,
          oppPartySocketId: senderId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage(listenEvents.onGetConversationMessages)
  async handleConvoMsgAndSeen(client: Socket, roomUsersId: RoomUsersIdType) {
    const { viewer, roomer } = roomUsersId;

    // getConversationObj
    const conversation = await this.conversationModel.findOne({
      $or: [
        { senderId: viewer, receiverId: roomer },
        { senderId: roomer, receiverId: viewer },
      ],
    });

    // if the viewer and roomer haven't conversated with each other
    if (!conversation) {
      // const viewerSocketId = this.onlineUser.get(viewer);
      client.emit(emitEvents.ejectReceiveConversation, []);
      return;
    }

    const conversationMessageId = conversation.messages || [];
    await this.messageModel.updateMany(
      {
        _id: { $in: conversationMessageId },
        senderId: { $ne: viewer }, // senderId is not viewer
      },
      { $set: { seen: true } },
    );

    // const viewerSocketId = onlineUser.get(viewer);
    const messages = await this.messageModel.find({
      _id: { $in: conversationMessageId }, // messageIdList is the array of message IDs
    });

    for (let i = messages.length - 1; i >= 0; i--) {
      const senderId = messages[i].senderId;
      if (senderId.toHexString() != viewer) {
        const senderSocketId = this.onlineUser.get(roomer);

        if (senderSocketId) {
          this.server
            .to(senderSocketId)
            .emit(emitEvents.ejectMessageSeen, messages[i]._id);
        }
        break;
      }
    }

    // TODO:
    client.emit(emitEvents.ejectReceiveConversation, messages);
  }

  @SubscribeMessage(listenEvents.onMessageSeen)
  async handleOppPartySeen(client: Socket, seenObj: SeenObjType) {
    const { newMessageId, senderId } = seenObj;

    await this.messageModel.findByIdAndUpdate(newMessageId, {
      $set: { seen: true },
    });

    const senderSocketId = this.onlineUser.get(senderId);
    if (senderSocketId) {
      this.server
        .to(senderSocketId)
        .emit(emitEvents.ejectMessageSeen, newMessageId);
    }
  }

  // equivalent to socket.on('disconnect')
  handleDisconnect(client: Socket) {
    const gonerMongoId = this.getMongoIdBySocketId(client.id);
    this.onlineUser.delete(gonerMongoId);

    console.log(this.onlineUser)

    this.server.emit(
      emitEvents.ejectOnlineUser,
      Array.from(this.onlineUser.values()),
    );
  }
}
