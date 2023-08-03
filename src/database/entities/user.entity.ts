import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { ErrandEntity } from "./errand.entity";
import { randomUUID } from "crypto";


@Entity({name: 'users'})


export class UserEntity{
    @PrimaryGeneratedColumn("uuid", { name: "id" })
    userId: string;
    
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @BeforeInsert()
    beforeInsert() {
    this.userId = randomUUID();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => ErrandEntity, (errand) => errand.user)
  errands: ErrandEntity[];

}