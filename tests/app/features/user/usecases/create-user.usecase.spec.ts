import {createUserUsecase} from "../../../../../src/app/features/user/usecases/create-user.usecase";
import {UserRepository} from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";


describe("Create User Usecase", () => {
    beforeAll(async () => {
      await Database.connect();
      await CacheDatabase.connect();
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
  
    afterAll(async () => {
      await Database.connection.destroy();
      await CacheDatabase.connection.quit();
    });

    const userMockSut = () => {
        return new User(
          "any_name",
          "any_email",
          "any_password",
        );
      };

    const createSut = () => {
        return new createUserUsecase();
    };

    test("deveria retornar sucesso caso o usuário seja criado", async () => {
        const user = userMockSut();
        const sut = createSut();
        
        const result = await sut.execute({
            name: "any_name",
            email: "any_email",
            password: "any_password"    
        });

        jest.spyOn(UserRepository.prototype, "create").mockResolvedValue(user);
        jest.spyOn(CacheRepository.prototype, "setEx").mockResolvedValue();
        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.code).toBe(201);
        expect(result.ok).toBe(true);
        expect(result.message).toBe("User successfully created");
        expect(result).toHaveProperty("data", result.data);
    });

    
});

