import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";

@Entity("integration.dexcom_configuration")
export class DexcomConfiguration {

    @PrimaryGeneratedColumn()
    id: number;

}