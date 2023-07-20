import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";

@Entity("errands")

export class ErrandEntity extends BaseEntity{
    @Column()
    description: string;

    @Column()
    detail: string;

    @Column({
        name: "user_id",
    })
    userId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({
        name: "user_id",
    })
    user: UserEntity;
}