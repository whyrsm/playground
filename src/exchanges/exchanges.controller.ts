import { Controller, Get } from '@nestjs/common';
import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesHyperliquidService } from './exchanges-hyperliquid.service';

@Controller('exchanges')
export class ExchangesController {
  constructor(
    private readonly hyperliquid: ExchangesHyperliquidService,
    private readonly binance: ExchangesBinanceService,
  ) {}

  private BINANCE_ASSET: string[] = ['BTC', 'ETH', 'SOL', 'BNB', 'USDT', 'USDC', 'NOT']
  private HYPERLIQUID_ASSET: string[] = ['HYPE', 'USDC']

  @Get('hyperliquid/balance')
  async getHyperliquidBalance() {
    return this.hyperliquid.fetchBalance(this.HYPERLIQUID_ASSET);
  }

  @Get('binance/balance')
  async getBinanceBalance() {
    return this.binance.fetchBalance(this.BINANCE_ASSET);
  }

  @Get('all/balance')
  async getBalance() {
    const assetHyperliquid = await this.hyperliquid.fetchBalance(this.HYPERLIQUID_ASSET);
    const assetBinance = await this.binance.fetchBalance(this.BINANCE_ASSET);
    const assetAll = [...assetHyperliquid, ...assetBinance];
    const totalUSDValue = assetAll.reduce(
      (acc, balance) => acc + parseFloat(balance.value.usd),
      0,
    );

    return {
      total_usd_value: totalUSDValue,
      assets: assetAll,
    };
  }
}
