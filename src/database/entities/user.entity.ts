import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { ErrandEntity } from "./errand.entity";
import { BaseEntity } from "./base.entity";


@Entity({name: 'users'})


export class UserEntity extends BaseEntity{
    @PrimaryColumn()
    userid: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => ErrandEntity, (errand) => errand.user)
    errands: ErrandEntity[];
}