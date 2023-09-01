import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";


describe("User Controller - LIST", () => {

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
    
    beforeEach(async () => {
        const repository = Database.connection.getRepository(UserEntity);
    
        await repository.clear();

        const cache = CacheDatabase.connection;
        await cache.flushall();
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
        await repository.create(user);
    };

    test("deveria retornar sucesso e indicação de cache se houve cache para a lista de usuários", async () => {
        const sut = createSut();

        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(true);

        const result = await request(sut).get("/users").send();

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "Users successfully listed in cache");
        expect(result.body).toHaveProperty("data");
    })

    test("deveria retornar sucesso sem indicação de cache se não houver cache", async () => {
        const sut = createSut();
        const user = new User(
            "any_name",
            "any_email@teste.com",
            "any_password"
        );
        await createUser(user);

        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
        jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

        const result = await request(sut).get("/users").send();

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "Users successfully listed");
        expect(result.body).toHaveProperty("data");
        expect(result.body.data.length).toBeGreaterThan(0);
    });

    test("deveria retornar sucesso e uma lista vazia se não houver nenhum usuário cadastrado", async () => {
        const sut = createSut();

        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
        jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

        const result = await request(sut).get("/users").send();

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "Users successfully listed");
        expect(result.body).toHaveProperty("data");
        expect(result.body.data).toHaveLength(0);
    });

});