import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('athena_mydata.athena_appointment')
export class athena_appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: "timestamp", default: () => "timezone('utc'::text, now())" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "timezone('utc'::text, now())", onUpdate: "timezone('utc'::text, now())" })
    updated_at: Date;

    @Column({ type: 'varchar', length: 100 })
    appointment_id: string;

    @Column({ type: 'varchar', length: 100 })
    status: string;

    @CreateDateColumn({ type: "timestamp" })
    last_updated_at: Date;

    @Column({ type: 'json' })
    content: string;

    @Column({ type: 'uuid' })
    athena_server_id: string;

    @Column({ type: 'uuid' })
    athena_primary_appointment_type_id: string;

    @Column({ type: 'uuid' })
    athena_primary_patient_id: string;

    @Column({ type: 'uuid' })
    athena_primary_practitioner_id: string;

    @Column({ type: 'uuid' })
    athena_primary_location_id: string;

    @Column({ type: 'varchar', length: 100 })
    security: string;

    @Column({ type: 'varchar', length: 255 })
    "slot.reference": string;

    @Column({ type: 'int' })
    duration: number;

    @Column({ type: 'boolean' })
    sync_docsink_invalid_data: boolean;

    @CreateDateColumn({ type: "timestamp" })
    start_date: Date;

    @CreateDateColumn({ type: "timestamp" })
    end_date: Date;
}