namespace Models {    
    export interface IRemoteAccount {
        id?: any;
        provider_type: string;
    }
    export interface ISearchItem {
        id: number;
        f_name: string;
        l_name: string;
        avatar?: any;
        remote_account: Array<IRemoteAccount>;
    }
    export interface ISearchResults {
        results: Array<ISearchItem>;
    }        
}