namespace Models {
    export interface INotifications{    
        alerts:Array<IAlert>;
        progress_reports:Array<IProgressReport>;
    }
    export interface IAlert {
        type:string;
        count:number;
    }
    export interface IProgressReport {
        id:number;
        date: string;
        message:string;
    }
}
