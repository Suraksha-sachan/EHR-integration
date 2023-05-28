import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, UpdateDateColumn, Timestamp, Double } from "typeorm";

@Entity("user")

export class User {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({type: "varchar" , nullable:false})
    email : string

    @Column({type: "varchar" , nullable:false})
    password : string

    @Column({type: "varchar" , nullable:false})
    first_name : string

    @Column({type: "varchar" , nullable:false})
    last_name : string

    @Column({ type: "int", nullable: false })
    org_id: number;

    @Column({ type: "int", nullable: false })
    user_type_id: number;

    @Column({ type: "boolean", nullable: false, default:false })
    email_appointment_schedule: boolean;

    @Column({type: "varchar" , nullable:false})
    hash : string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @CreateDateColumn({ type: "timestamp", default : null})
    public recovery_date: Date;

    @Column({type: "varchar" , nullable:false})
    default_role : string

    @Column({type: "varchar" , nullable:false})
    facebook_id : string

    @Column({type: "varchar" , nullable:false})
    google_id : string

    @Column({ type: "boolean", nullable: false, default:true })
    active: boolean

    @Column({type: "varchar" , nullable:false})
    security_hash : string

    @Column({type: "varchar" , nullable:false})
    image : string

    @Column({ type: "boolean", nullable: false, default:true })
    receive_push_notices: boolean

    @CreateDateColumn({ type: "timestamp", default : null})
    public last_seen_datetime: Date;

    @Column({ type: "int", nullable: false , default:10})
    message_refresh_interval: number;

    @Column({ type: "int", default: null})
    phone_number: number;

    @Column({ type: "int", default: null})
    department_id: number;

    @Column({ type:"boolean", default:0 })
    telehealth_availability:boolean

    @Column({type:"int",default:null })
    specialty : number;

    @Column( {type:"int",default:null })
    office_id : number;

    @Column({type:"boolean", default:0})
    is_master : boolean;

    @Column ({type:"int",default:0})
    login_attempts : number;

    @Column({type:"varchar",default:null})
    chat_status:string;

    @Column({type:"boolean", default:0})
    is_interface_user:boolean;

    @Column({type:"boolean", default:1})
    verified:string;

    @Column({type:"boolean",default:0})
    org_verified:boolean;

    @Column({type:"int",default:null})
    terms_accepted:boolean;

    @Column({type:"int",default:null})
    console_tourbus_verify:boolean;

    @Column({type:"varchar",default:null})
    salesforce_id:string;

    @Column({type:"varchar",default:null})
    remember_token:string;

    @Column({type:"timestamp", default:null})
    deleted_at:Timestamp;

    @Column({type:"varchar",default:null})
    uuid:string;

    @Column({type:"int",default:null})
    language_id:number;


    @Column({type:"boolean",default:0})
    teleheath_5_minute_check_in:boolean

    @Column({type:"varchar",default:0})
    teleheath_5_minute_check_in_type : string

    // @Column({type:"double",default:null})
    // provider_notification_email_minutes:string

    @Column({type:"text",default:null})
    mfa_secret: string

}

