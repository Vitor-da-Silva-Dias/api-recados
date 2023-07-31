import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTable1690354320225 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "crud_users_errands"."errands" ADD CONSTRAINT "FK_errands_users" FOREIGN KEY ("user_id") REFERENCES "crud_users_errands"."users"("id")`
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "crud_users_errands"."errands" DROP CONSTRAINT "FK_errands_users"`
        );

    }

}
