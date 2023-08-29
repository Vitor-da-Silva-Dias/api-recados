import { LoginUsecase } from "../../../../../src/app/features/user/usecases/login.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { Database } from "../../../../../src/main/database/database.connection";
import { User } from "../../../../../src/app/models/user.model";


describe("Delete User Usecase", () => {
    beforeAll(async () => {
      await Database.connect();
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();

      jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(userMockSut);
    });
  
    afterAll(async () => {
      await Database.connection.destroy();
    });

    const userMockSut = new User(
        "any_name",
        "any_email",
        "any_password",
      );

    const createSut = () => {
        return new LoginUsecase();
    };

    test("deveria retornar falha caso o email informado não exista", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(undefined);

        const result = await sut.execute({
            email: "any_email",
            password: "any_password"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("User not found");
    });

    test("deveria retornar falha caso a senha esteja incorreta", async () => {
        const sut = createSut();

        const result = await sut.execute({
            email: "any_email",
            password: "wrong_password"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(401);
        expect(result.message).toEqual("Invalid credentials");
    });

    test("deveria retornar sucesso caso todos os dados estejam corretos", async () => {
        const sut = createSut();

        const result = await sut.execute({
            email: "any_email",
            password: "any_password"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("Login successfully done");
        expect(result).toHaveProperty("data", userMockSut.toJson());
    });
});