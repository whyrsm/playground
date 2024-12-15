import { Module } from '@nestjs/common';
import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesController } from './exchanges.controller';
import { ExchangesHyperliquidService } from './exchanges-hyperliquid.service';
import { ExchangesBitgetService } from './exchanges-bitget.service';
import { PortfolioSnapshotService } from './portfolio-snapshot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioSnapshot } from '../entities/portfolio-snapshot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioSnapshot])],
  controllers: [ExchangesController],
  providers: [
    ExchangesHyperliquidService,
    ExchangesBitgetService,
    PortfolioSnapshotService,
    {
      provide: 'BinanceServiceAccountPrimary',
      useFactory: () => new ExchangesBinanceService('primary'),
    },
    {
      provide: 'BinanceServiceAccountSecondary',
      useFactory: () => new ExchangesBinanceService('secondary'),
    },
  ],
})
export class ExchangesModule {}
