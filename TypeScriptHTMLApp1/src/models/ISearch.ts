namespace Models {
    export interface IResults {
        results: Array<IResultItem>;
    }
    export interface IResultItem {
        id: number;
        f_name: string;
        l_name: string;
        avatar?: any;
        remote_account: Array<IRemoteAccount>;
    }
    export interface IRemoteAccount {
        id?: any;
        provider_type: string;
    }    
}