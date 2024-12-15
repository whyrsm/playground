import { Controller, Get, Post } from "@nestjs/common";
import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesHyperliquidService } from './exchanges-hyperliquid.service';
import { ExchangesBitgetService } from './exchanges-bitget.service';
import { PortfolioSnapshotService } from "./portfolio-snapshot.service";

@Controller('exchanges')
export class ExchangesController {
  constructor(
    private readonly hyperliquid: ExchangesHyperliquidService,
    private readonly binance: ExchangesBinanceService,
    private readonly bitget: ExchangesBitgetService,
    private readonly snapshotService: PortfolioSnapshotService,
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
    console.log('Hyperliquid', assetHyperliquid);
    const assetBinance = await this.binance.fetchBalance(this.BINANCE_ASSET);
    console.log('Binance', assetBinance);
    const assetBitget = await this.bitget.fetchBalance(this.BITGET_ASSET);
    console.log('Bitget', assetBitget);
    const assetAll = [...assetHyperliquid, ...assetBinance, ...assetBitget];
    await this.snapshotService.save(assetAll);
    return assetAll;
  }

  @Post('remove-data')
  async removeData() {
    await this.snapshotService.deleteAll();
  }
}
