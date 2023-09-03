import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { error } from "console";
import { createUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";


describe("User Controller - CREATE", () => {

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

    test("deveria retornar falha caso não seja informado o name", async () => {
        const sut = createSut();

        const result = await request(sut).post("/users").send({
            email: "any_email",
            password: "any_password",
        });

        expect(result).toBeDefined();
        expect(result.status).toEqual(400);
    
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Name not provided");
        expect(result.body).not.toHaveProperty("code");
    });

    test("deveria retornar falha caso não seja informado o email", async () => {
        const sut = createSut();

        const result = await request(sut).post("/users").send({
            name:"any_name",
            password: "any_password",
        });

        expect(result).toBeDefined();
        expect(result.status).toEqual(400);
    
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Email not provided");
        expect(result.body).not.toHaveProperty("code");
    });

    test("deveria retornar falha caso não seja informado o password", async () => {
        const sut = createSut();

        const result = await request(sut).post("/users").send({
            name:"any_name",
            email: "any_email",
        });

        expect(result).toBeDefined();
        expect(result.status).toEqual(400);
    
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Password not provided");
        expect(result.body).not.toHaveProperty("code");
    });


    test("deveria retornar falha caso o email já exista", async () => {
    const sut = createSut();
    const user = new User("any_name", "any_email", "any_password");

    await createUser(user);

    const result = await request(sut).post("/users").send({
        name:"any_name",
        email: "any_email",
        password: "any_password"
    });
    

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toBe("Email already registered");
    });

    test("Deveria retornar sucesso se o usuário for criado", async () => {
        const sut = createSut();
        
        jest.spyOn(CacheRepository.prototype, "setEx").mockResolvedValue();
        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

        const result = await request(sut).post("/users").send({
            name: "newUser",
            email: "newemail@teste.com",
            password: "12345",  
        });


        expect(result).toBeDefined();
        expect(result.status).toBe(201);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("ok", true);
        expect(result.body).toHaveProperty("message", "User successfully created");
        expect(result.body).toHaveProperty("data");
      });

      test("deveria executar o bloco catch (erro 500 - falha no servidor)", async () => {
        const sut = createSut();
       
        const mockError = new Error();

        jest.spyOn(createUserUsecase.prototype, 'execute').mockRejectedValueOnce(mockError);

  
        const result = await request(sut).post("/users").send({
            name: "error",
            email: "error@teste.com",
            password: "12345",  
        });
  
        
        expect(result).toBeDefined();
        expect(result.status).toBe(500);
        expect(result).toHaveProperty("body");
        expect(result).toHaveProperty("ok", false);
      });

});  

