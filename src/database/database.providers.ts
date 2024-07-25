import * as mongoose from 'mongoose';
import { dbProvider } from 'src/constants';

export const databaseProviders = [
  {
    provide: dbProvider.database,
    useFactory: async (): Promise<typeof mongoose> => {
      try {
        const dbConnection = await mongoose.connect(process.env.MONGO_URI);
        console.log(
          'successfully connected database with version',
          dbConnection.version,
        );
        
        return dbConnection;
      } catch (error) {
        console.log(error);
        throw new Error('Error in database connection: ' + error);
      }
    },
  },
];
