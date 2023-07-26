import { v4 as createUuid } from "uuid";
import { Errand } from "./errand.model";
import { UserEntity } from "../database/entities/user.entity";

export class User{
    private _userId: string;
    public _errands: Errand[]; 
    constructor(
        public _name: string,
        public _email: string,
        private _password: string,
    ){
        this._userId = createUuid();
    }

    public get userId(){
        return this._userId;
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
            id: this._userId,
            name: this._name,
            email: this._email,
            password: this._password,
            errands: this._errands
        };
    }

    public static create(row: UserEntity) {
        const user = new User(row.name, row.email, row.password);
        user._userId = row.id;

        return user;
    }
}