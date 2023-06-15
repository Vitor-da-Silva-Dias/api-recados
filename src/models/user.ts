import { v4 as createUuid } from "uuid";
import { Errand } from "./errand";

export class User{
    private _id: string;
    constructor(
        private _email: string,
        private _password: string,
        private _errands: Errand[] = []
    ){
        this._id = createUuid();
    }

    public get id(){
        return this._id;
    }

    public get email(){
        return this._email;
    }

    public set email(email:string){
        this._email = email;
    }

    public get password(){
        return this._password;
    }

    public set password(password:string){
        this._password = password;
    }

    public get errands(){
        return this._errands;
    }

    public toJson(){
        return{
            id: this._id,
            email: this._email,
            password: this.password,
            errands: this.errands
        };
    }
}