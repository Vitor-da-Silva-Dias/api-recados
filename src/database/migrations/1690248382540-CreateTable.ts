import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableUsers1690248382540 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "users",
            columns: [
              {
                name: "id",
                type: "uuid",
                isNullable: false,
                isPrimary: true,
              },
              {
                name: "name",
                type: "varchar",
                length: "255",
                isNullable: false,
              },
              {
                name: "email",
                type: "varchar",
                length: "255",
                isNullable: false,   
              },
              {
                name: "password",
                type: "varchar",
                length: "255",
                isNullable: false,
              },
              
              {
                name: "created_at",
                type: "timestamp",
                isNullable: false,
              },
              {
                name: "updated_at",
                type: "timestamp",
                isNullable: false,
              },
            ],
          })
        );
      }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users", true, true, true);
    }

}

export class CreateTableErrands1690248382540 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "errands",
            columns: [
              {
                name: "id",
                type: "uuid",
                isNullable: false,
                isPrimary: true,
              },
              {
                name: "description",
                type: "varchar",
                length: "255",
                isNullable: false,
              },
              {
                name: "detail",
                type: "varchar",
                length: "255",
                isNullable: false,   
              },
              {
                name: "user_id",
                type: "varchar",
                isNullable: false,
              },
              {
                name: "created_at",
                type: "timestamp",
                isNullable: false,
              },
              {
                name: "updated_at",
                type: "timestamp",
                isNullable: false,
              },
            ],
          })
        );
      }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("errands", true, true, true);
    }

}