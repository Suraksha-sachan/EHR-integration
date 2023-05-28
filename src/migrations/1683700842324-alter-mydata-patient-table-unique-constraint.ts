import { MigrationInterface, QueryRunner } from "typeorm"

export class alterMydataPatientTableUniqueConstraint1683700842324 implements MigrationInterface {
    name = 'alterMydataPatientTableUniqueConstraint1683700842324';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        ALTER TABLE integration.mydata_patient
        DROP CONSTRAINT IF EXISTS mydata_patient_mydata_configuration_unique,
        DROP CONSTRAINT IF EXISTS mydata_patient_patient_id_unique;
        
        ALTER TABLE integration.mydata_patient
        ADD CONSTRAINT mydata_patient_id_mydata_configuration_id_uk unique(patient_id,mydata_configuration);`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
        ALTER TABLE integration.mydata_patient
        DROP CONSTRAINT if exists mydata_patient_id_mydata_configuration_id_uk;`
        )
    }

}
