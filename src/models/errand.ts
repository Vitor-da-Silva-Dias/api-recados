import { v4 as createUuid } from "uuid";

export class Errand {
    private _idErrand: string;
    constructor(
        private _description: string,
        private _detail: string
    ){
        this._idErrand = createUuid();
    }

    public get idErrand(){
        return this._idErrand;
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
            id: this._idErrand,
            description: this._description,
            detail: this.detail
        };
    }
}