import { Connection } from 'mongoose';
import { BlogSchema } from '../schemas/blog.schema';
import { dbModels, dbProvider } from 'src/constants';

export const blogProviders = [
  {
    provide: dbModels.Blog,

    useFactory: (connection: Connection) =>
      connection.model('Blog', BlogSchema),

    inject: [dbProvider.database],
  },
];
