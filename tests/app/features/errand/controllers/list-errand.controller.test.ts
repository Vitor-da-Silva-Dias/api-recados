import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { ErrandEntity } from "../../../../../src/app/shared/database/entities/errand.entity";
import { listErrandUsecase } from "../../../../../src/app/features/errand/usecases/list-errand-usecase";


describe("Errand Controller - LIST", () => {

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

        const result = await request(sut).get("/users/:userId/errands").send()

        expect(result).toBeDefined();
        expect(result.status).toBe(404);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "User not found");
        expect(result.body).toHaveProperty("code", 404);
    });

    test("deveria retornar sucesso e indicação de cache se houve cache para a lista de usuários", async () => {
        const sut = createSut();

        const user = await createUser(newUser); 


        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(true);

        const result = await request(sut).get(`/users/${user.userId}/errands`).send()

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "Errands successfully listed in cache");
        expect(result.body).toHaveProperty("code", 200);
        expect(result.body).toHaveProperty("data");
    });

    test("deveria retornar sucesso sem indicação de cache se não houver cache", async () => {
        const sut = createSut();

        const user = await createUser(newUser);
       
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
        jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();


        const result = await request(sut).get(`/users/${user.userId}/errands`).send()

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "Errands successfully listed");
        expect(result.body).toHaveProperty("code", 200);
        expect(result.body).toHaveProperty("data");

    });

    test("deveria executar o bloco catch (erro 500 - falha no servidor)", async () => {
        const sut = createSut();

        const user = await createUser(newUser);

        const mockError = new Error();

        jest.spyOn(listErrandUsecase.prototype, 'execute').mockRejectedValueOnce(mockError);

        const result = await request(sut).get(`/users/${user.userId}/errands`).send()

        expect(result).toBeDefined();
        expect(result.status).toBe(500);
        expect(result).toHaveProperty("body");
        expect(result).toHaveProperty("ok", false);

    });
});