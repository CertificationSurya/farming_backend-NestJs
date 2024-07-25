import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/user.schema';
import { dbModels, dbProvider } from 'src/constants';

export const userProviders = [
  {
    provide: dbModels.User,

    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),

    inject: [dbProvider.database],
  },
];
