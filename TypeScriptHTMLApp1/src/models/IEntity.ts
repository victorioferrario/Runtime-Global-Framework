namespace Models {
    export interface IEntity {
        name: string;
        user:IUser;
        logos:Array<IEntityLogo>;
    }
    export interface IEntityLogo {
        alt : string;
        src: string;
        type: string;
        className:string;
    }
    export interface IUser {
        avatar: string;
        email : string;
        id : number;
        name : string;
        type : string;
    }
}
