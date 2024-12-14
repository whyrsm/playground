import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class ExchangesBitgetService {
  private bitget;
  private BITGET: string = 'BITGET';

  constructor() {
    this.bitget = new ccxt.bitget({
      apiKey: process.env.BITGET_API_KEY,
      secret: process.env.BITGET_SECRET_KEY,
      password: process.env.BITGET_PASSWORD,
    });
  }

  private formatNumber(value: number): string {
    return value.toFixed(9);
  }

  async fetchBalance(tokens: string[]): Promise<any> {
    try {
      // Get user balances
      const balance = await this.bitget.fetchBalance();

      // create trading pairs for each coin
      const tradingPairs = tokens
        .filter((token) => token.toUpperCase() !== 'USDT')
        .map((token) => `${token}/USDT`);

      // fetch tickers for the traiding pairs
      const tickers = await this.bitget.fetchTickers(tradingPairs);

      return tokens.map((token) => {
        const normalizedToken: string = token.toUpperCase();
        const balanceAmount = balance.total[normalizedToken] || 0;
        // handle USD price
        const usdPrice =
          normalizedToken === 'USDT'
            ? 1
            : tickers[`${normalizedToken}/USDT`]?.last || 0;

        const usdValue = balanceAmount * usdPrice;

        return {
          asset: normalizedToken,
          balance: this.formatNumber(balanceAmount),
          value: {
            usd: this.formatNumber(usdValue),
          },
          source: this.BITGET,
          last_update: new Date().toISOString(),
        };
      });
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
  }
}
