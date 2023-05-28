import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from 'dotenv';

config();

export function createTypeOrmPgsqlConfig(
  config: PostgresConnectionOptions,
): PostgresConnectionOptions {
  return {
    name :process.env.POSTGRES_CONNECTION_NAME,
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE || '',
    synchronize: false,
    logger: 'advanced-console',
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: false,
    logging: false,
    ...config,
  };
}