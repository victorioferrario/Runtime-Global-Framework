namespace Models {
    export interface IEntity {
        name: string;
        logos:Array<IEntityLogo>;
    }
    export interface IEntityLogo {
        alt : string;
        src: string;
        type: string;
        className:string;
    }
}
