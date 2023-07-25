import * as dotenv from "dotenv";
import { DataSource } from "typeorm";


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
    entities: ["src/database/entities/**/*.ts"],  
    migrations: ["src/database/migrations/**/*.ts"],
});

export default dataSource;
