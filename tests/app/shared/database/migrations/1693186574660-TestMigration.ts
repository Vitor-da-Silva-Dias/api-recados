import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1693186574660 implements MigrationInterface {
    name = 'TestMigration1693186574660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "errands" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar NOT NULL, "detail" varchar NOT NULL, "archived" boolean NOT NULL, "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_errands" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar NOT NULL, "detail" varchar NOT NULL, "archived" boolean NOT NULL, "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_5434b7fdce54c1566a88cf554f6" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_errands"("id", "description", "detail", "archived", "user_id", "created_at", "updated_at") SELECT "id", "description", "detail", "archived", "user_id", "created_at", "updated_at" FROM "errands"`);
        await queryRunner.query(`DROP TABLE "errands"`);
        await queryRunner.query(`ALTER TABLE "temporary_errands" RENAME TO "errands"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "errands" RENAME TO "temporary_errands"`);
        await queryRunner.query(`CREATE TABLE "errands" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar NOT NULL, "detail" varchar NOT NULL, "archived" boolean NOT NULL, "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "errands"("id", "description", "detail", "archived", "user_id", "created_at", "updated_at") SELECT "id", "description", "detail", "archived", "user_id", "created_at", "updated_at" FROM "temporary_errands"`);
        await queryRunner.query(`DROP TABLE "temporary_errands"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "errands"`);
    }

}
