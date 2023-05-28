import { Entity, Index, PrimaryGeneratedColumn, JoinColumn, OneToMany, Column } from "typeorm";
import { Dexcom } from "../dexcom.entity";

@Entity("integration.docsink_patient")
export class DocsinkPatient {

  @PrimaryGeneratedColumn()
  @OneToMany(
        () => Dexcom,
        (dexcom) => dexcom.patient,
        {
          nullable: true,
        },
      )
    id: number;

    @Column({ type: "int", default: null })
    uuid : number;

}