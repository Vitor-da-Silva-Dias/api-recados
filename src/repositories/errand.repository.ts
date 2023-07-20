import { Database } from "../database/config/database.connection";
import { ErrandEntity } from "../database/entities/errand.entity";
import { Errand } from "../models/errand.model";
import { UserRepository } from "./user.repository";


interface ListErrandsParams{
    userId: string,
}

export class ErrandRepository{
    private repository = Database.connection.getRepository(ErrandEntity);

    public async create(errand: Errand) {
        const ErrandEntity = this.repository.create({
            id: errand.errandId,
            description: errand.description,
            detail: errand.detail,
            userId: errand.user.userId
        });

        await this.repository.save(ErrandEntity);
    }

    public async list(params: ListErrandsParams) {
        const result = await this.repository.find({
            where: {
                userId: params.userId,
            },
            relations: {
                user: true,
            },
        });

        return result.map((row) => this.mapRowToModel(row));
    }

    public async get(id: string) {
        const result = await this.repository.findOneBy({
            id,
        });

        if (!result) {
            return undefined;
        }

        return this.mapRowToModel(result);
    }

    public async delete(id: string) {
        const result = await this.repository.delete({
            id,
        });

        return result.affected ?? 0;
    }

    public async update(errand: Errand) {
        await this.repository.update(
            {
                id: errand.errandId,
            },
            {
                description: errand.description,
                detail: errand.detail
            }
        );
    }

    private mapRowToModel(row: ErrandEntity) {
        const user = UserRepository.mapRowToModel(row.user);

        return Errand.create(row, user);
    }
}