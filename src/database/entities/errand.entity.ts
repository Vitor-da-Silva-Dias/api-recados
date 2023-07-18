import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("errands")

export class ErrandEntity{
    @PrimaryColumn()
    errandid: string;

    @Column()
    description: string;

    @Column()
    detail: string;

    @Column({
        name: "created_at",
    })
    createdAt: Date;

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