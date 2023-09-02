import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { ErrandEntity } from "../../../../../src/app/shared/database/entities/errand.entity";


describe("Errand Controller - CREATE", () => {

    beforeAll(async () => {
        await Database.connect();
        await CacheDatabase.connect();
    });

    beforeEach(async () => {
        
    })
    
    afterAll(async () => {
        const ErrandRepository = Database.connection.getRepository(ErrandEntity);
        const userRepository = Database.connection.getRepository(UserEntity);
      
        await ErrandRepository.clear();
        await userRepository.clear();
        
  
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

    const newUser = new User(
        "any_name",
        "any_email",
        "any_password"
    );

    test("deveria retornar falha caso o usuário não seja encontrado", async () => {
        const sut = createSut();

        const result = await request(sut).post("/users/:userId/errands").send({
            description: "any_description",
            detail: "any_detail"
        })

        expect(result).toBeDefined();
        expect(result.status).toBe(404);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body.message).toBe("User not found");
        expect(result.body).toHaveProperty("code", 404);
    });

    test("deveria retornar falha caso não seja informada a description", async () => {
        const sut = createSut();
        const user = await createUser(newUser);

        const result = await request(sut).post(`/users/${user.userId}/errands`).send({
            detail: "any_detail"
        })

        expect(result).toBeDefined();
        expect(result.status).toBe(400);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Description not provided");
    });

    test("deveria retornar falha caso não seja informado o detail", async () => {
        const sut = createSut();
        const user = await createUser(newUser);

        const result = await request(sut).post(`/users/${user.userId}/errands`).send({
            description: "any_description"
        })

        expect(result).toBeDefined();
        expect(result.status).toBe(400);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Detail not provided");
    });

    test("deveria retornar sucesso caso o recado seja criado", async () => {
        const sut = createSut();
        const user = await createUser(newUser);

        jest.spyOn(CacheRepository.prototype, "setEx").mockResolvedValue();
        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();


        const result = await request(sut).post(`/users/${user.userId}/errands`).send({
            description: "any_description",
            detail: "any_detail"
        })

        expect(result).toBeDefined();
        expect(result.status).toBe(201);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "Errand successfully created");
        expect(result.body).toHaveProperty("data");
    });
});