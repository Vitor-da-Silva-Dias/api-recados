import { v4 as createUuid } from "uuid";
import { User } from "./user.model";
import { ErrandEntity } from "../database/entities/errand.entity";


export class Errand {
    private _errandId: string;
    
    constructor(
        private _description: string,
        private _detail: string,
        private _user: User,
        public _archived: boolean = false
    ){
        this._errandId = createUuid();
    }

    public get errandId(){
        return this._errandId;
    }

    public get description(){
        return this._description;
    }

    public set description(description:string){
        this._description = description;
    }

    public get detail(){
        return this._detail;
    }

    public set detail(detail:string){
        this._detail = detail;
    }

    public get archived(){
        return this._archived;
    }

    public set archived(archived: boolean){
        this._archived = archived;
    }

    public get user() {
        return this._user;
      }

      

    public toJson(): any{
        return{
            id: this._errandId,
            description: this._description,
            detail: this.detail,
            archived: this._archived,
        };
    }

    public static create(row: ErrandEntity, user: User) {
        const errand = new Errand(row.description, row.detail, user, row.archived);
        errand._errandId = row.errandId;

        return errand;
    }
}