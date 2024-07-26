import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { marketplaceProviders } from './marketplace.provider';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MarketplaceController],
  providers: [MarketplaceService, ...marketplaceProviders],
})
export class MarketplaceModule {}
