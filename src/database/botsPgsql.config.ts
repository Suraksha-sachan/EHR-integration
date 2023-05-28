import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from 'dotenv';
import { alterMydataTablesConstraints1682501802285 } from 'src/migrations/1682501802285-alter-mydata_tables_constraints';
import { alterMydataPatientTableUniqueConstraint1683700842324 } from 'src/migrations/1683700842324-alter-mydata-patient-table-unique-constraint';
import { alterMydataAppointmentAndTypeConstraint1684390024010 } from 'src/migrations/1684390024010-alter-mydata-appointment-and-type-constraint';
import { alterDocsinkTablesUniqueConstraints1684390424075 } from 'src/migrations/1684390424075-alter-docsink-tables-unique-constraints';
config();

export function createTypeOrmBotsPgsqlConfig(
  config: PostgresConnectionOptions,
): PostgresConnectionOptions {
  return {
    name :process.env.BOTS_CONNECTION_NAME,
    type: 'postgres',
    host: process.env.BOTS_HOST,
    username: process.env.BOTS_USER,
    password: process.env.BOTS_PASSWORD,
    database: process.env.BOTS_DATABASE || '',
    //schema: process.env.BOTS_SCHEMA,
    synchronize: false,
    logger: 'advanced-console',
    // entities:[],
     migrations: [alterMydataTablesConstraints1682501802285,alterMydataPatientTableUniqueConstraint1683700842324, alterMydataAppointmentAndTypeConstraint1684390024010, alterDocsinkTablesUniqueConstraints1684390424075],
    // migrationsTableName: 'migrations',
    migrationsRun: true,
    logging: false,
    ...config,
  };
}