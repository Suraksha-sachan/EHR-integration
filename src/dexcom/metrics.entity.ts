import { Entity, Column,CreateDateColumn, UpdateDateColumn, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("integration.metrics")
@Index(['patient_id', 'uuid'], { unique: true }) 
export class Metrics {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @CreateDateColumn({ type: "timestamp", default: null })
    public dexcom_timestamp : Date;

    @Column({ type: "int",  default: null })
    uuid: number;

    @Column({ type: "int",  default: null })
    patient_id: number;

    @Column({ type: 'varchar', length: 50, default: null })
    value: string;

    @Column({ type: 'varchar', length: 50, default: null })
    unit: string;

}

