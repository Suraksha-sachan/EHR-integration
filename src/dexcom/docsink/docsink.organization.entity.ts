import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Dexcom } from "../dexcom.entity";

@Entity("integration.docsink_organization")
export class DocsinkOrganization {

  @PrimaryGeneratedColumn()
    @OneToMany(
        () => Dexcom,
        (dexcom) => dexcom.organization,
        {
          nullable: true,
        },
      )
      id: number;

      @Column({ type: "int", default: null })
      uuid : number;

}