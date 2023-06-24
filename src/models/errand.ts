import { v4 as createUuid } from "uuid";

export class Errand {
    private _errandId: string;
    public _archived: boolean;
    constructor(
        private _description: string,
        private _detail: string,
    ){
        this._errandId = createUuid();
        this._archived = false;
    }

    public get idErrand(){
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

    public toJson(){
        return{
            id: this._errandId,
            description: this._description,
            detail: this.detail,
            archived: this._archived
        };
    }
}