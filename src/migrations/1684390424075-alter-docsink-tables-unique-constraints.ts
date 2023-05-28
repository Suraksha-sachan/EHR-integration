import { MigrationInterface, QueryRunner } from "typeorm"

export class alterDocsinkTablesUniqueConstraints1684390424075 implements MigrationInterface {
    name = 'alterDocsinkTablesUniqueConstraints1684390424075';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        alter table integration.docsink_appointment_type 
        drop constraint IF EXISTS docsink_appointment_type_uuid_unique,
        drop constraint IF EXISTS docsink_appointment_type_docsink_organization_unique;
       
        alter table integration.docsink_appointment_type 
        add constraint docsink_appointment_type_docsink_organization_uuid_unique UNIQUE(docsink_organization, uuid);

        alter table integration.docsink_appointment 
        drop constraint IF EXISTS docsink_appointment_docsink_organization_unique,
        drop constraint IF EXISTS docsink_appointment_uuid_unique;

        alter table integration.docsink_appointment
        add constraint docsink_appointment_docsink_organization_uuid_unique UNIQUE(docsink_organization,uuid);

        alter table integration.docsink_location 
        add constraint docsink_location_uuid_docsink_organization_uk unique(docsink_organization,uuid);

        alter table integration.docsink_provider  
        drop constraint IF EXISTS docsink_provider_uuid_unique,
        add constraint docsink_provider_uuid_docsink_organization_uk unique(uuid , docsink_organization);

        alter table integration.docsink_office
        drop constraint IF EXISTS docsink_office_uuid_unique,
        drop constraint IF EXISTS docsink_office_docsink_organization_unique,
        add constraint docsink_office_uuid_docsink_office_uk unique(uuid , docsink_organization);

        alter table integration.docsink_patient 
        drop constraint IF EXISTS docsink_patient_uuid_unique,
        add constraint docsink_patient_uuid_docsink_organization_unique unique(uuid , docsink_organization);

        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        alter table integration.docsink_appointment
        drop constraint IF EXISTS docsink_appointment_docsink_organization_uuid_unique;
       
        alter table integration.docsink_appointment_type
        drop constraint IF EXISTS docsink_appointment_type_docsink_organization_uuid_unique;

        alter table integration.docsink_location 
        drop constraint IF EXISTS docsink_location_uuid_docsink_organization_uk;

        alter table integration.docsink_provider  
        drop constraint IF EXISTS docsink_provider_uuid_docsink_organization_uk;

        alter table integration.docsink_office
        drop constraint IF EXISTS docsink_office_uuid_docsink_office_uk;

        alter table integration.docsink_patient 
        drop constraint IF EXISTS docsink_patient_uuid_docsink_organization_unique;
        
        `)
    }

}
