import { Controller, Get } from "@nestjs/common";
import { ExchangesBinanceService } from './exchanges-binance.service';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly binance: ExchangesBinanceService) {}

  @Get('balance')
  async getBalance() {
    const coinArray: string[] = ['BTC', 'ETH', 'USDT', 'USDC', 'SOL'];
    return this.binance.fetchBalance(coinArray);
  }

  @Get('transactions')
  async getTransactions() {
    return this.binance.fetchTransactions();
  }
}