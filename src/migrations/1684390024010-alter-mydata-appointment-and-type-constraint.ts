import { MigrationInterface, QueryRunner } from "typeorm"

export class alterMydataAppointmentAndTypeConstraint1684390024010 implements MigrationInterface {
    name = 'alterMydataAppointmentAndTypeConstraint1684390024010';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
         alter table integration.mydata_appointment_type 
         drop constraint IF EXISTS mydata_appointment_type_mydata_configuration_unique;
        
         alter table integration.mydata_appointment_type 
         add constraint mydata_appointment_type_mydata_configuration_code_unique UNIQUE(mydata_configuration, code);

         alter table integration.mydata_appointment 
         drop constraint IF EXISTS mydata_appointment_appointment_id_unique,
         drop constraint IF EXISTS mydata_appointment_mydata_configuration_unique;
 
         alter table integration.mydata_appointment 
         add constraint mydata_appointment_id_mydata_configuration_unique unique(appointment_id,mydata_configuration);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
          
            alter table integration.mydata_appointment_type 
            drop constraint IF EXISTS mydata_appointment_type_mydata_configuration_code_unique;

            alter table mydata_appointment 
            drop constraint IF EXISTS mydata_appointment_id_mydata_configuration_unique;
        `)
    }

}
