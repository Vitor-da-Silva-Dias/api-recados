import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { randomUUID } from "crypto";
// import { BaseEntity } from "./base.entity";

@Entity("errands")

export class ErrandEntity{
    @PrimaryGeneratedColumn("uuid", { name: "id" })
    errandId: string;

    @Column()
    description: string;

    @Column()
    detail: string;

    @Column()
    archived: boolean;

    @Column({
        name: "user_id",
        type: "uuid"
    })
    userId: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @BeforeInsert()
    beforeInsert() {
    this.errandId = randomUUID();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

   @BeforeUpdate()
   beforeUpdate() {
   this.updatedAt = new Date();
  }

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id", referencedColumnName: 'userId' })
  user: UserEntity;
    
}