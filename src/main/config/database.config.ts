import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { UserEntity } from "../../app/shared/database/entities/user.entity";
import { ErrandEntity } from "../../app/shared/database/entities/errand.entity";
import { CreateTableErrands1690248382540, CreateTableUsers1690248382540 } from "../../app/shared/database/migrations/1690248382540-CreateTable";
import { AlterTable1690354320225 } from "../../app/shared/database/migrations/1690354320225-AlterTable";


dotenv.config();

const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    logging: true,
    synchronize: false,
    schema: 'crud_users_errands',
    entities: [UserEntity, ErrandEntity],  
    migrations: [CreateTableUsers1690248382540, CreateTableErrands1690248382540 ,AlterTable1690354320225],
});

export default dataSource;
