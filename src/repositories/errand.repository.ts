import { Database } from "../database/config/database.connection";
import { ErrandEntity } from "../database/entities/errand.entity";
import { Errand } from "../models/errand.model";
import { UserRepository } from "./user.repository";


interface ListErrandsParams{
    userId?: string,
    errandId?: string
}

export class ErrandRepository{
    private repository = Database.connection.getRepository(ErrandEntity);

    public async create(errand: Errand) {
        const ErrandEntity = this.repository.create({
            errandId: errand.errandId,
            description: errand.description,
            detail: errand.detail,
            archived: errand.archived,
            userId: errand.user.userId
        });

        await this.repository.save(ErrandEntity);
    }

    public async list(params: ListErrandsParams) {
        const result = await this.repository.find({
            where: {
                userId: params.userId,
            },
            relations: ["user"], 
        });
    
        return result.map((row) => this.mapRowToModel(row));
    }
    

    public async get(params: ListErrandsParams) {
        const result = await this.repository.findOne({
            where: {
                errandId: params.errandId,
            },
            relations: ["user"], 
        });

        if(!result){
            return undefined;
        }
    
        return this.mapRowToModel(result);
    }

    public async delete(errandId: string) {
        const result = await this.repository.delete({
            errandId,
        });

        return result.affected ?? 0;
    }

    public async update(errand: Errand) {
        await this.repository.update(
            {
                errandId: errand.errandId,
            },
            {
                description: errand.description,
                detail: errand.detail,
                archived:errand.archived
            }
        );
    }

    private mapRowToModel(row: ErrandEntity) {
        console.log(row.user);
        
        const user = UserRepository.mapRowToModel(row.user);

        return Errand.create(row, user);
    }
}