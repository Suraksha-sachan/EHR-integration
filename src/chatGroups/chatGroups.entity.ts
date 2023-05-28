import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("groups")
export class ChatGroups {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, default: null })
    legacy_id: string;

    @Column({ type: 'varchar', length: 100, default: null })
    name: string;

    @Column({ type: "int", nullable: false })
    org_id: number;

    @Column({ type: "int", nullable: false })
    created_by: number;

    @Column({ type: "int", nullable: false })
    updated_by: number;

    @Column({ type: 'varchar', length: 100, default: null })
    description: string;

    @Column({ type: 'varchar', length: 100, default: null })
    topic: string;

    @Column({ type: 'varchar', length: 100, default: null })
    image: string;

    @Column({ type: "int", nullable: false })
    patient_id: number;

    @Column({ type: "int", nullable: false })
    type_id: number;

    @Column({ type: "boolean", nullable: false , default: false })
    is_archived: boolean;

    @Column({ type: "int", nullable: false })
    specialty_id: number;

    @Column({ type: "int", nullable: false })
    department_id: number;

    @Column({ type: "int", nullable: false })
    phone: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}

