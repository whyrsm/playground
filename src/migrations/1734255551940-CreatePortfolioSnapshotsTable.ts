import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePortfolioSnapshotsTable1734255551940
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'portfolio_snapshot',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'asset',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'balance',
            type: 'decimal',
            precision: 18,
            scale: 9,
            isNullable: false,
          },
          {
            name: 'value_usd',
            type: 'decimal',
            precision: 18,
            scale: 9,
            isNullable: false,
          },
          {
            name: 'source',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'last_update',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('portfolio_snapshot');
  }
}
