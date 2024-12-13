import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class ExchangesBinanceService {
  private binance;
  private BINANCE: string = 'BINANCE';

  constructor() {
    this.binance = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_SECRET_KEY,
    });
  }

  private formatNumber(value: number): string {
    return value.toFixed(9);
  }

  async fetchBalance(coins: string[]): Promise<any> {
    try {
      // Get user balances
      const balance = await this.binance.fetchBalance();

      // create trading pairs for each coin
      const tradingPairs = coins
        .filter((coin) => coin.toUpperCase() !== 'USDT')
        .map((coin) => `${coin}\USDT`);

      // fetch tickers for the traiding pairs
      const tickers = await this.binance.fetchTickers(tradingPairs);

      return coins.map((coin) => {
        const normalizedCoin: string = coin.toUpperCase();
        const balanceAmount = balance.total[normalizedCoin] || 0;
        // handle USD price
        const usdPrice =
          normalizedCoin === 'USDT'
            ? 1
            : tickers[`${normalizedCoin}/USDT`]?.last || 0;

        const usdValue = balanceAmount * usdPrice;

        return {
          asset: normalizedCoin,
          balance: this.formatNumber(balanceAmount),
          value: {
            usd: this.formatNumber(usdValue),
          },
          source: this.BINANCE,
        };
      });
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
  }
}
