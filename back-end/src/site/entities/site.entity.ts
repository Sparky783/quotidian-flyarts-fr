import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("sites")
export class Site {
    @PrimaryGeneratedColumn({ name: "id_site" })
    idSite: number;
    
    @Column({ name: "id_user" })
    idUser: number;
    
    @Column()
    name: string;
    
    @Column()
    url: string;
    
    @Column()
    frequency: string;
    
    @Column({ type: "date", name: "next_date" })
    nextDate: Date;
    
    @Column({ type: "datetime", name: "last_visit" })
    lastVisit: Date;

    @OneToOne(type => User, user => user.idUser)
    user: User;
}