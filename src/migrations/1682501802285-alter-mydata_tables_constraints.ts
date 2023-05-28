import { MigrationInterface, QueryRunner } from "typeorm"

export class alterMydataTablesConstraints1682501802285 implements MigrationInterface {
    name = 'alterMydataTablesConstraints1682501802285';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE integration.mydata_location
            DROP CONSTRAINT IF EXISTS mydata_location_location_id_unique;
            
            ALTER TABLE integration.mydata_location
            add constraint mydata_location_location_mydata_configuration_id_uk unique(location_id,mydata_configuration);
            
            ALTER TABLE integration.mydata_practitioner
            DROP constraint IF EXISTS mydata_practitioner_practitioner_id_unique;

           ALTER TABLE integration.mydata_practitioner
           add constraint mydata_practitioner_practitioner_mydata_configuration_id_uk unique(practitioner_id,mydata_configuration);

            ALTER TABLE integration.mydata_organization
            add constraint mydata_organization_organization_mydata_configuration_id_uk unique(organization_id,mydata_configuration);`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE integration.mydata_location
        DROP constraint IF EXISTS mydata_location_location_mydata_configuration_id_uk;
        
        ALTER TABLE integration.mydata_practitioner
        DROP constraint IF EXISTS mydata_practitioner_practitioner_mydata_configuration_id_uk;
        
         ALTER TABLE integration.mydata_organization
        DROP constraint IF EXISTS mydata_organization_organization_mydata_configuration_id_uk;`
        )

    }

}
