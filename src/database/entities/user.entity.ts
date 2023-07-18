import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { ErrandEntity } from "./errand.entity";


@Entity({name: 'users'})


export class UserEntity{
    @PrimaryColumn()
    userid: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        name: "created_at",
    })
    createdAt: Date;

    @OneToMany(() => ErrandEntity, (errand) => errand.user)
    errands: ErrandEntity[];
}