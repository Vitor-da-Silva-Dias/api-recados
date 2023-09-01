import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";


describe("User Controller - UPDATE", () => {

    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });
    
    afterAll(async () => {
        const repository = Database.connection.getRepository(UserEntity);
      
        await repository.clear();
  
        const cache = CacheDatabase.connection;
        await cache.flushall();
  
        await Database.connection.destroy();
        await CacheDatabase.connection.quit();
    });
      
  
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
      
    const createSut = () => {
        return createApp();
    };
    
    const createUser = async (user: User) => {
        const repository = new UserRepository();
        const result =  await repository.create(user);
        return result;
    };

    test("deveria retornar falha caso não sejam informados o email ou o password do usuário", async () =>{
        const sut = createSut();

        const result = await request(sut).post("/users/login").send({})

        expect(result).toBeDefined();
        expect(result.status).toBe(401);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Invalid credentials");
        expect(result.body).toHaveProperty("code", 401);
    });

    test("deveria retornar falha caso o email informado não exista", async () => {
        const sut = createSut();

        const result = await request(sut).post("/users/login").send({
            email:"any_email",
            password: "any_password"
        })

        expect(result).toBeDefined();
        expect(result.status).toBe(404);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "User not found");
        expect(result.body).toHaveProperty("code", 404);
    });

    test("deveria retornar falha caso a senha esteja incorreta", async () => {
        const sut = createSut();
        const newUser = new User(
            "any_name",
            "any_email@teste.com",
            "any_password"
        );
        const user = await createUser(newUser);

        const result = await request(sut).post("/users/login").send({
            email: user.email,
            password: "wrong_password"
        })

        expect(result).toBeDefined();
        expect(result.status).toBe(401);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Invalid credentials");
        expect(result.body).toHaveProperty("code", 401);
    });

    test("deveria retornar sucesso caso todos os dados estejam corretos", async () => {
        const sut = createSut();
        const newUser = new User(
            "any_name",
            "any_email@teste.com",
            "any_password"
        );
        const user = await createUser(newUser);

        const result = await request(sut).post("/users/login").send({
            email: user.email,
            password: user.password
        })

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "Login successfully done");
        expect(result.body).toHaveProperty("code", 200);
        expect(result.body).toHaveProperty("data");
    });

});