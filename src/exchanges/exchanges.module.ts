import { Module } from '@nestjs/common';
import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesController } from './exchanges.controller';
import { ExchangesHyperliquidService } from './exchanges-hyperliquid.service';

@Module({
  controllers: [ExchangesController],
  providers: [ExchangesBinanceService, ExchangesHyperliquidService],
})
export class ExchangesModule {}
