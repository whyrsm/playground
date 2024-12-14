import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class ExchangesHyperliquidService {
  private hyperliquid;
  private HYPERLIQUID: string = 'HYPERLIQUID';

  constructor() {
    this.hyperliquid = new ccxt.hyperliquid();
  }

  private formatNumber(value: number): string {
    return value.toFixed(9);
  }

  async fetchBalance(tokens: string[]): Promise<any> {
    try {
      // Get user balances
      const balance = await this.hyperliquid.fetchBalance({
        user: '0x74B897a6E5255406c3C8E5816736f18E1881E52b',
        type: 'spot',
      });

      // create trading pairs for each token
      const tradingPairs = tokens
        .filter((token) => token.toUpperCase() !== 'USDC')
        .map((token) => `${token}/USDC`);

      // fetch tickers for the traiding pairs
      const tickers = await this.hyperliquid.fetchTickers(tradingPairs, 'spot');

      return tokens.map((token) => {
        const normalizedToken: string = token.toUpperCase();
        const balanceAmount = balance.total[normalizedToken] || 0;
        // handle USD price
        const usdPrice =
          normalizedToken === 'USDC'
            ? 1
            : tickers[`${normalizedToken}/USDC`]?.last || 0;

        const usdValue = balanceAmount * usdPrice;

        return {
          asset: normalizedToken,
          balance: this.formatNumber(balanceAmount),
          value: {
            usd: this.formatNumber(usdValue),
          },
          source: this.HYPERLIQUID,
          last_update: new Date().toISOString(),
        };
      });
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
  }
}
