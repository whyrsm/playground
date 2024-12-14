import { Controller, Get } from '@nestjs/common';
import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesHyperliquidService } from './exchanges-hyperliquid.service';
import { ExchangesBitgetService } from './exchanges-bitget.service';

@Controller('exchanges')
export class ExchangesController {
  constructor(
    private readonly hyperliquid: ExchangesHyperliquidService,
    private readonly binance: ExchangesBinanceService,
    private readonly bitget: ExchangesBitgetService,
  ) {}

  private BINANCE_ASSET: string[] = ['BTC', 'ETH', 'SOL', 'BNB', 'USDT', 'USDC', 'NOT'];
  private BITGET_ASSET: string[] = ['BTC', 'ETH', 'USDT', 'USDC', 'BGB'];
  private HYPERLIQUID_ASSET: string[] = ['HYPE', 'USDC'];

  @Get('hyperliquid/balance')
  async getHyperliquidBalance() {
    return this.hyperliquid.fetchBalance(this.HYPERLIQUID_ASSET);
  }

  @Get('binance/balance')
  async getBinanceBalance() {
    return this.binance.fetchBalance(this.BINANCE_ASSET);
  }

  @Get('bitget/balance')
  async getBitgetBalance() {
    return this.bitget.fetchBalance(this.BITGET_ASSET);
  }

  @Get('all/balance')
  async getBalance() {
    const assetHyperliquid = await this.hyperliquid.fetchBalance(this.HYPERLIQUID_ASSET);
    const assetBinance = await this.binance.fetchBalance(this.BINANCE_ASSET);
    const assetBitget = await this.bitget.fetchBalance(this.BITGET_ASSET);
    const assetAll = [...assetHyperliquid, ...assetBinance, ...assetBitget];
    const totalUSDValue = assetAll.reduce(
      (acc, balance) => acc + parseFloat(balance.value_usd),
      0,
    );

    return {
      total_usd_value: totalUSDValue,
      assets: assetAll,
    };
  }
}
