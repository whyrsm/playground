import { Injectable } from '@nestjs/common';
import * as ccxt from 'ccxt';

@Injectable()
export class ExchangesBinanceService {
  private binance;

  constructor() {
    this.binance = new ccxt.binance({
      // apiKey: process.env.BINANCE_API_KEY,
      // secret: process.env.BINANCE_SECRET_KEY,
    });
  }

  async fetchBalance() {
    try {
      const balance = await this.binance.fetchBalance();
      return balance;
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
  }

  async fetchTransactions() {
    try {
      const trades = await this.binance.fetchMyTrades();
      return trades;
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
  }
}