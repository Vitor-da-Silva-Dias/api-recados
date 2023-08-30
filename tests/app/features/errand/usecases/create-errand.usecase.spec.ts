import {createErrandUsecase} from "../../../../../src/app/features/errand/usecases/create-errand.usecase";
import {UserRepository} from "../../../../../src/app/features/user/repositories/user.repository";
import { ErrandRepository } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { User } from "../../../../../src/app/models/user.model";
import { Errand } from "../../../../../src/app/models/errand.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";


describe("Create Errand Usecase", () => {
    beforeAll(async () => {
      await Database.connect();
      await CacheDatabase.connect();
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    const userMockSut = new User(
        "any_name",
        "any_email",
        "any_password",
    );
      
  
    afterAll(async () => {
      await Database.connection.destroy();
      await CacheDatabase.connection.quit();
    });

    const createSut = () => {
        return new createErrandUsecase;
    };

    test("deveria retornar falha caso o usuário não seja encontrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(undefined);

        const result = await sut.execute({
            description: "any_description",
            detail: "any_detail",
            userId: "any_userId"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("User not found");
    });

    test("deveria retornar sucesso caso o recado seja criado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);

        jest.spyOn(ErrandRepository.prototype, "create").mockResolvedValue();

        const result = await sut.execute ({
            description: "any_description",
            detail: "any_detail",
            userId: "any_userId",

        })

        
        jest.spyOn(CacheRepository.prototype, "setEx").mockResolvedValue();
        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.code).toBe(201);
        expect(result.ok).toBe(true);
        expect(result.message).toEqual("Errand successfully created");
        expect(result).toHaveProperty("data");
    })
});