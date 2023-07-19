import { v4 as createUuid } from "uuid";
import { Errand } from "./errand.model";
import { UserEntity } from "../database/entities/user.entity";

export class User{
    private _userid: string;
    constructor(
        private _name: string,
        private _email: string,
        private _password: string,
        private _errands: Errand[] = []
    ){
        this._userid = createUuid();
    }

    public get userid(){
        return this._userid;
    }

    public get name(){
        return this._name;
    }

    public set name(name:string){
        this._name = name;
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
            id: this._userid,
            name: this._name,
            email: this._email,
            password: this.password,
            errands: this.errands
        };
    }

    public static create(row: UserEntity) {
        const user = new User(row.email, row.name, row.password);
        user._userid = row.userid;

        return user;
    }
}