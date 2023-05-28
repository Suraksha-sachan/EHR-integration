import { createTypeOrmBotsPgsqlConfig } from "./src/database";
import { DataSource } from "typeorm";

const datasource = new DataSource(createTypeOrmBotsPgsqlConfig({
  entities: ['dist/**/*.entity{.ts,.js}'],
  type: 'postgres',
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  migrationsRun: true,
}));

datasource.initialize();
export default datasource; 