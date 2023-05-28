import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany } from "typeorm";
import {Expose,Exclude} from 'class-transformer';
import { optimusEncode } from "src/utils/common";

@Entity("ehr_fax_order_bot")
export class EhrFaxOrder {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;
    @Expose()
    get uuid(){
        return `${optimusEncode(this.id)}`
    }

    @Column({ type: "int", nullable: false })
    org_id: number;

    @Column({ type: "boolean", nullable: false })
    active: boolean;

    @Column({ type: "int", nullable: false })
    app_id: number;

    @Column({ type: "date", nullable: false })
    created_at: Date;
    
    @Column({ type: "date", nullable: false })
    updated_at: Date;
}