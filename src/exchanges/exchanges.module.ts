import { Module } from '@nestjs/common';
import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesController } from './exchanges.controller';
import { ExchangesHyperliquidService } from './exchanges-hyperliquid.service';
import { ExchangesBitgetService } from './exchanges-bitget.service';

@Module({
  controllers: [ExchangesController],
  providers: [
    ExchangesBinanceService,
    ExchangesHyperliquidService,
    ExchangesBitgetService,
  ],
})
export class ExchangesModule {}
