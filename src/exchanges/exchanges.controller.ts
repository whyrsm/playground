// @ts-ignore

import { Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ExchangesBinanceService } from './exchanges-binance.service';
import { ExchangesHyperliquidService } from './exchanges-hyperliquid.service';
import { ExchangesBitgetService } from './exchanges-bitget.service';
import { PortfolioSnapshotService } from "./portfolio-snapshot.service";

@Controller('exchanges')
export class ExchangesController {
  constructor(
    private readonly hyperliquid: ExchangesHyperliquidService,
    private readonly bitget: ExchangesBitgetService,
    private readonly snapshotService: PortfolioSnapshotService,
    @Inject('BinanceServiceAccountPrimary')
    private readonly binancePrimary: ExchangesBinanceService,
    @Inject('BinanceServiceAccountSecondary')
    private readonly binanceSecondary: ExchangesBinanceService,
  ) {}

  private BINANCE_ASSET: string[] = ['BTC', 'ETH', 'SOL', 'BNB', 'USDT', 'USDC', 'NOT'];
  private BITGET_ASSET: string[] = ['BTC', 'ETH', 'USDT', 'USDC', 'BGB'];
  private HYPERLIQUID_ASSET: string[] = ['HYPE', 'USDC'];

  private calculateSummary(assets: any[]) {
    const summary = {};

    assets.forEach((asset) => {
      const { asset: symbol, balance, value_usd } = asset;

      if (!summary[symbol]) {
        summary[symbol] = {
          totalBalance: 0,
          totalValueUsd: 0,
        };
      }

      summary[symbol].totalBalance += parseFloat(balance);
      summary[symbol].totalValueUsd += parseFloat(value_usd);
    });

    // Convert summary object into an array for a clean response
    return Object.keys(summary).map((symbol) => ({
      asset: symbol,
      totalBalance: summary[symbol].totalBalance.toFixed(9),
      totalValueUsd: summary[symbol].totalValueUsd.toFixed(2),
    }));
  }

  @Get('hyperliquid/balance')
  async getHyperliquidBalance() {
    return this.hyperliquid.fetchBalance(this.HYPERLIQUID_ASSET);
  }

  @Get('binance/balance')
  async getBinanceBalance(@Query('account') account: string) {

    if (account === 'primary') {
      return this.binancePrimary.fetchBalance(this.BINANCE_ASSET);
    } else if (account === 'secondary') {
      return this.binanceSecondary.fetchBalance(this.BINANCE_ASSET);
    } else {
      throw new Error(
        'Invalid account parameter. Use "primary" or "secondary".',
      );
    }
  }

  @Get('bitget/balance')
  async getBitgetBalance() {
    return this.bitget.fetchBalance(this.BITGET_ASSET);
  }

  @Get('snapshot')
  async getBalance() {
    const assetHyperliquid = await this.hyperliquid.fetchBalance(this.HYPERLIQUID_ASSET);
    console.log('Hyperliquid', assetHyperliquid);
    const assetBinancePrimary = await this.binancePrimary.fetchBalance(this.BINANCE_ASSET);
    console.log('Binance Primary', assetBinancePrimary);

    const assetBinanceSecondary = await this.binanceSecondary.fetchBalance(this.BINANCE_ASSET);
    console.log('Binance Secondary', assetBinanceSecondary);

    const assetBitget = await this.bitget.fetchBalance(this.BITGET_ASSET);
    console.log('Bitget', assetBitget);

    const assetAll = [
      ...assetHyperliquid,
      ...assetBinancePrimary,
      ...assetBinanceSecondary,
      ...assetBitget,
    ];

    const response = {
      exchanges: [
        { exchange: 'Hyperliquid', balances: assetHyperliquid },
        { exchange: 'Binance Primary', balances: assetBinancePrimary },
        { exchange: 'Binance Secondary', balances: assetBinanceSecondary },
        { exchange: 'Bitget', balances: assetBitget },
      ],
      summary: this.calculateSummary(assetAll),
      status: 'pending',
      error: undefined,
    };

    try {
      await this.snapshotService.save(assetAll);
      response.status = 'success';
    } catch (error) {
      response.status = 'error';
      response.error = {
        message: 'Failed to save snapshot into database',
        details: error.message,
      };
    }

    return response;
  }

  @Post('remove-data')
  async removeData() {
    const response = {
      status: 'pending',
      message: undefined,
      error: undefined,
    };
    try {
      await this.snapshotService.deleteAll();
      response.status = 'success';
      response.message = 'Successfully removed';
    } catch (error) {
      response.status = 'error';
      response.error = {
        message: 'Failed to remove data',
        details: error.message,
      };
    }
    return response;
  }
}

