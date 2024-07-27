import { Connection, Model } from 'mongoose';
import { dbModels, dbProvider } from 'src/constants';
import { IMessage } from '../dto/chat.dto';
import { MessageSchema } from 'src/schemas/chat.schema';

export const messageProvider = [
  {
    provide: dbModels.Chat,

    useFactory: (connection: Connection): Model<IMessage> => connection.model<IMessage>("Message", MessageSchema),

    inject: [dbProvider.database]

  },
];
