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
    export interface ISearchItemContext {
        id: number;
        f_name: string;
        l_name: string;
        avatar?: any;
        remote_account: Array<IRemoteAccount>;
        fullname: string;
    }
    export enum SearchItemContextType {
        Normal = 0,
        Header = 1,
        Splitter = 2,
        SearchById = 3,
        All = 4,
    }
    export class SearchItemContext {
        id: number;
        f_name: string;
        l_name: string;
        avatar: any;
        remote_account: Array<IRemoteAccount>;
        fullname: string;
        type: SearchItemContextType;
        constructor(data: ISearchItem) {
            const self = this;
            if (data !== null) {
                self.id = data.id;
                self.f_name = data.f_name;
                self.l_name = data.l_name;                
                self.remote_account = data.remote_account;
                self.fullname = self.f_name + " " + self.l_name;
                self.avatar = data.avatar === null ? `<i class="material-icons">account_circle</i>` : `<img src="${data.avatar}" 
                style="margin-top:-5px;width: 30px!important;height: 30px!important;margin-left: 10px;" class="thumb img-responsive img-circle" alt="${self.fullname}"/>account_circle</i>`;
                self.type = SearchItemContextType.Normal;
            } else {
                self.type = SearchItemContextType.Splitter;
            }
        }
    }
    export interface ISearchResults {
        results: Array<ISearchItem>;
    }
}