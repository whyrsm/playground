import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioSnapshot } from '../entities/portfolio-snapshot.entity';

@Injectable()
export class PortfolioSnapshotService {
  constructor(
    @InjectRepository(PortfolioSnapshot)
    private readonly snapshotRepository: Repository<PortfolioSnapshot>,
  ) {}

  async save(data: Array<Record<string, any>>): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    // Delete existing snapshot entries for today to avoid duplicates
    await this.snapshotRepository.delete({ date: today });

    // Save each balance entry as a new row
    const snapshotEntries = data.map((entry) =>
      this.snapshotRepository.create({
        date: today,
        asset: entry.asset,
        balance: entry.balance,
        valueUsd: entry.value_usd,
        source: entry.source,
        lastUpdate: entry.last_update,
      }),
    );

    await this.snapshotRepository.save(snapshotEntries);
  }

  async getSnapshotByDate(date: string): Promise<PortfolioSnapshot[]> {
    return await this.snapshotRepository.find({ where: { date } });
  }

  async deleteAll(): Promise<void> {
    return await this.snapshotRepository.clear();
  }
}
