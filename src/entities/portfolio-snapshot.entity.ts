import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('portfolio_snapshot')
export class PortfolioSnapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'asset', length: 100 })
  asset: string;

  @Column({ name: 'balance', type: 'decimal', precision: 18, scale: 9 })
  balance: string;

  @Column({ name: 'value_usd', type: 'decimal', precision: 18, scale: 9 })
  valueUsd: string;

  @Column({ length: 100 })
  source: string;

  @Column({ name: 'last_update', type: 'timestamp' })
  lastUpdate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
