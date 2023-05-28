import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('integration.dexcom_logs')
export class DexcomLogs {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @Column({ type: 'varchar', length: 100, default: null })
    statuscode: string;

    @Column({ type: 'varchar', length: 20480, default: null })
    endpoint: string;

    @Column({ type: 'varchar',length: 50 })
    method: string;

    @Column({ type: 'text'})
    request_data: string;

    @Column({ type: 'text'})
    response_data: string;

    @Column({type: 'integer'})
    access_token: string

}