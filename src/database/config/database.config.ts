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
    schema: 'transactions',
    entities: ['src/database/entities/**/*.ts'],
    // entities: [UserEntity]    
});

export default dataSource;
