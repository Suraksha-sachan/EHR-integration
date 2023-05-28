import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { BotTokens } from "./botTokens.entity";

@Entity("apps")
export class Apps {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: "int", nullable: false })
    org_id: number;

    @Column({ type: "int", nullable: false })
    created_by: number;

    @Column({ type: "int", nullable: false })
    modified_by: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public modified_at: Date;

    @Column({ type: 'varchar', length: 255, default: null })
    name: string;

    @Column({ type: 'varchar', length: 255, default: null })
    description: string;

    @Column({ type: 'varchar', length: 255, default: null })
    image: string;

    @Column({ type: "boolean", nullable: false , default: true })
    active: boolean;

    @Column({ type: "boolean", nullable: false , default: false })
    deleted: boolean;

    @Column({ unique: true , type: 'varchar', length: 255, nullable: false })
    hash_id: string;

    @Column({ type: 'bigint', default: null })
    oauth_client_id: number;

    @Column({ type: "bigint", default: null})
    bot_client_id: number;

    @Column({ type: "boolean", default: false})
    is_bot_enabled: boolean;

    @Column({ type: 'varchar', length: 255, default: null})
    events_url: string;

    @Column({unique: true, type: 'varchar', length: 255, default: null})
    uuid: string;

    @Column({ type: 'text'})
    long_description: string;

    @Column({ type: 'text'})
    privacy_policy_link: string;

    @Column({ type: 'text'})
    terms_of_service_link: string;

    @Column({ type: 'text'})
    website_link: string;

    @Column({ type: 'varchar', length: 40, default: null})
    lead_email: string;

    @Column({ type: 'boolean',default: false})
    is_first_party: boolean;

    @Column({unique: true, type: 'varchar', length: 255, default: null})
    url: string;

    @Column({ type: 'bigint', default: null})
    app_category_id: number;

    @Column({ type: 'text'})
    auth_type: string;

    @Column({ type: 'text'})
    configuration_page: string;

    @Column({ type: 'varchar', length: 255, default: null})
    video_url: string;

    @Column({ type: 'boolean', nullable: false , default: false})
    require_eula: boolean;

    @Column({ type: 'varchar', length: 255, default: null})
    eula_url: string;

    @Column({ type: 'boolean', nullable: false , default: true , comment : '1=URL,2=FILE'})
    installation_guide_type: boolean;

    @Column({ type: 'varchar', length: 255, default: null})
    installation_guide_url: string;

    @Column({ type: 'varchar', length: 255, default: null})
    permissions: string;

}