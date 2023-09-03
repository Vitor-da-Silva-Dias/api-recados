import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { ErrandEntity } from "../../../../../src/app/shared/database/entities/errand.entity";
import { Errand } from "../../../../../src/app/models/errand.model";
import { ErrandRepository } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { deleteErrandUsecase } from "../../../../../src/app/features/errand/usecases/delete-errand-usecase";


describe("Errand Controller - DELETE", () => {

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

    const createErrand = async (errand: Errand) => {
        const repository = new ErrandRepository();
        const result =  await repository.create(errand);
        return result;
    };

    test("deveria retornar falha caso o usuário não seja encontrado", async () => {
        const sut = createSut();

        const result = await request(sut).delete("/users/:userId/errands/:errandId").send()

        expect(result).toBeDefined();
        expect(result.status).toBe(404);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "User not found");
        expect(result.body).toHaveProperty("code", 404);
    });

    test("deveria retornar falha caso o recado não seja encontrado", async () => {
        const sut = createSut();

        const user = await createUser(newUser);

        const result = await request(sut).delete(`/users/${user.userId}/errands/:errandId`)
        .send()

        expect(result).toBeDefined();
        expect(result.status).toBe(404);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Errand not found");
        expect(result.body).toHaveProperty("code", 404);
    });

    test("deveria retornar sucesso caso o recado seja deletado", async () => {
        const sut = createSut();

        const user = await createUser(newUser);
        const newErrand = new Errand(
            "any_description",
            "any_detail",
            user
        );
        const errand = await createErrand(newErrand);
        
        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

        const result = await request(sut).delete(`/users/${user.userId}/errands/${errand.errandId}`)
        .send()

        expect(result).toBeDefined();
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "Errand successfully deleted");
        expect(result.body).toHaveProperty("code", 200);
        expect(result.body).toHaveProperty("data");
    });

    test("deveria executar o bloco catch (erro 500 - falha no servidor)", async () => {
        const sut = createSut();
        const user = await createUser(newUser);
        const newErrand = new Errand(
            "any_description",
            "any_detail",
            user
        );
        const errand = await createErrand(newErrand);

        const mockError = new Error();

        jest.spyOn(deleteErrandUsecase.prototype, 'execute').mockRejectedValueOnce(mockError);

        const result = await request(sut).delete(`/users/${user.userId}/errands/${errand.errandId}`)
        .send()

        expect(result).toBeDefined();
        expect(result.status).toBe(500);
        expect(result).toHaveProperty("body");
        expect(result).toHaveProperty("ok", false);
    });
})