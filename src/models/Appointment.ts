import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import DateTimeFormat = Intl.DateTimeFormat;

@Entity('appointments')
class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider: string;

    @Column({ type: "timestamp", nullable: true })
    date: Date;

}

export default Appointment;