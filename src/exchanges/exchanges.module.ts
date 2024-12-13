import { Module } from '@nestjs/common';
import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesController } from './exchanges.controller';

@Module({
  controllers: [ExchangesController],
  providers: [ExchangesBinanceService],
})
export class ExchangesModule {}
