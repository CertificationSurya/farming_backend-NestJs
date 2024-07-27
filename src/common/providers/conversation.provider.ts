import { Connection, Model } from 'mongoose';
import { dbModels, dbProvider } from 'src/constants';
import { ConversationSchema } from 'src/schemas/chat.schema';
import { IConversation } from '../dto/chat.dto';

export const conversationProvider = [
  {
    provide: dbModels.Conversation,

    useFactory: (connection: Connection): Model<IConversation> =>
      connection.model<IConversation>('Conversation', ConversationSchema),

    inject: [dbProvider.database]
  },
];
