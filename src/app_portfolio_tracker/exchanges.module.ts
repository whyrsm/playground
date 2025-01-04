import { Module } from '@nestjs/common';
import { ExchangesBinanceService } from './services/exchanges-binance.service';
import { ExchangesController } from './controllers/exchanges.controller';
import { ExchangesHyperliquidService } from './services/exchanges-hyperliquid.service';
import { ExchangesBitgetService } from './services/exchanges-bitget.service';
import { PortfolioSnapshotService } from './services/portfolio-snapshot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioSnapshot } from './entities/portfolio-snapshot.entity';

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
