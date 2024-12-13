import { Controller, Get } from '@nestjs/common';
import { ExchangesBinanceService } from './exchanges-binance.service';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly binance: ExchangesBinanceService) {}

  @Get('balance')
  async getBalance() {
    return this.binance.fetchBalance();
  }

  @Get('transactions')
  async getTransactions() {
    return this.binance.fetchTransactions();
  }
}