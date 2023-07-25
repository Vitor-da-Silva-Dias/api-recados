import { v4 as createUuid } from "uuid";
import { User } from "./user.model";
import { ErrandEntity } from "../database/entities/errand.entity";


export class Errand {
    private _errandId: string;
    public _archived: boolean;
    constructor(
        private _description: string,
        private _detail: string,
        private _user: User
    ){
        this._errandId = createUuid();
        this._archived = false;
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

    public get user(): User {
        return this._user;
    }

    public toJson(){
        return{
            id: this._errandId,
            description: this._description,
            detail: this.detail,
            archived: this._archived,
            user: this._user?.toJson(),
        };
    }

    public static create(row: ErrandEntity, user: User) {
        const errand = new Errand(row.description, row.detail, user);
        errand._errandId = row.id;

        return errand;
    }
}