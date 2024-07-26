import { Connection } from 'mongoose';
import { dbModels, dbProvider } from 'src/constants';
import { MarketPlaceSchema } from 'src/schemas/marketplace.schema';

export const marketplaceProviders = [
  {
    provide: dbModels.Marketplace,

    useFactory: (connection: Connection) =>
      connection.model('Marketplace', MarketPlaceSchema),

    inject: [dbProvider.database],
  },
];
