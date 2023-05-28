import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { config } from 'dotenv';

config();

export function createTypeOrmMysqlConfig(
  config: MysqlConnectionOptions,
): MysqlConnectionOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || '',
    synchronize: false,
    logger: 'advanced-console',
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: false,
    logging: false,
    ...config,
  };
}