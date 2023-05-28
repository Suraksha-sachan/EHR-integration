import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { AppCategories } from "./appCategories.entity";
import { BotTokens } from "./botTokens.entity";

@Entity("app_submissions")
export class AppSubmissions {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'bigint', nullable:false })
    app_id: number;

    @Column({ type: 'bigint', nullable:false })
    submitted_by: number;

    @Column({ type: 'bigint', default:null })
    reviewed_by: number;

    @Column({ type: 'varchar', length: 255, default: null })
    status: string;

    @Column({ type: 'bigint', nullable:false })
    category_id: number;

    @Column({ type: 'varchar', length: 1024, default: null })
    review_details: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public modified_at: Date;

    @Column({ type: 'varchar', length: 1024, default: null })
    response_details: string;

}