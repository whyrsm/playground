import { Controller, Get } from '@nestjs/common';
// import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesHyperliquidService } from './exchanges-hyperliquid.service';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly hyperliquid: ExchangesHyperliquidService) {}

  @Get('balance')
  async getBalance() {
    return this.hyperliquid.fetchBalance(['HYPE', 'USDC']);
    // return this.binance.fetchBalance(['BTC', 'ETH', 'USDT', 'USDC', 'SOL']);
  }
}
