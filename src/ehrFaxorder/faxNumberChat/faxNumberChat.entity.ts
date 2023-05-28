import { Exclude, Expose } from "class-transformer";
import { optimusEncode } from "src/utils/common";
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("ehr_fax_number_chat")

export class FaxNumberChat {
    
    @Exclude()
    @PrimaryGeneratedColumn()
    id: Number;
    @Expose()
    get uuid(){
        return `${optimusEncode(this.id)}`
    }

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @Column({ type: "int", nullable: false })
    org_id: number;

    @Column({ type: "int", nullable: false })
    created_by: number;

    @Column({ type: "bigint", nullable: false })
    fax_number: number;

    @Column({ type: 'json' })
    fax_chat_id: any;

    @Column({ type: 'json'})
    fax_channel_name: any;
}

