import { Entity, Column, CreateDateColumn, UpdateDateColumn, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { DocsinkOrganization } from "./docsink/docsink.organization.entity";
import { DocsinkPatient } from "./docsink/docsink.patient.entity";

@Entity("integration.dexcom_access_tokens")
@Index(['id'], { unique: true })
export class Dexcom {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DocsinkOrganization, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'docsink_organization', referencedColumnName: 'id' })
  organization: number;

  @ManyToOne(() => DocsinkPatient, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'docsink_patient', referencedColumnName: 'id' })
  patient: number;

  @Column({ type: "int", default: null })
  docsink_patient: number;

  @Column({ type: "int", default: null })
  docsink_organization: number;

  @Column({ type: 'varchar', length: 20480, default: null })
  access_token: string;

  @Column({ type: 'varchar', length: 20480, default: null })
  refresh_token: string;

  @Column({ type: "int", default: null })
  expires_in: number;

  @CreateDateColumn({ type: "timestamp", default: null })
  last_refreshed_at: Date;

  @CreateDateColumn({ type: "timestamp", default: null })
  last_run_timestamp: Date;
}