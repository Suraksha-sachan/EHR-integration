import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Apps } from "./apps.entity";
import { AppSubmissions } from "./appSubmissions.entity";

@Entity("bot_tokens")
export class BotTokens {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 255, nullable:false })
    token_id: string;

    @Column({ type: 'bigint', nullable:false })
    app_id: number;

    @Column({ type: 'bigint', nullable:false })
    org_id: number;

    @Column({ type: 'varchar', length: 20480, nullable:false })
    token: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public modified_at: Date;
}

