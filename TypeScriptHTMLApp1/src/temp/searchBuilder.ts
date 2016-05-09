/// <reference path="../../typings/tsd.d.ts" />
namespace Temp {
    export class service {
        static loadJson(url?: string): JQueryXHR {
            return $.getJSON(url !== "" ? url : "data.json");
        }
    }
    export class TestContext extends Core.EventDispatcher {
        isLoadedSearch: boolean = false;
        payloadSearch: Models.ISearchResults;
        constructor() {
            super();

        }
        initialize() {
            const self = this;

        }
        loadSearhResults(): Q.Promise<Models.ISearchResults> {
            const self = this;
            Services.Http.loadJson("data-search.json").fail(() => {
                Q.reject("Error Loading Search");
                return null;
            }).done((result: Models.ISearchResults) => {
                self.isLoadedSearch = true;
                self.payloadSearch = result;
                Q.resolve(result);
            }).always(() => {
                return Q.resolve(self.payloadSearch);
            });
            return null;
        }
    }

    export class SearchContext {

        contextSearch: KnockoutObservable<string>;
        itemsPerPageCount: KnockoutObservable<number>;
        watchItemsPerPageCount: KnockoutComputed<string>;
        isNoConsultationFlag: KnockoutObservable<boolean>;
        //#region [ Properties            ]

        isBack: KnockoutComputed<string>;
        isNext: KnockoutComputed<string>;

        totalCount: KnockoutObservable<number>;
        totalPages: KnockoutObservable<number>;
        currentPage: KnockoutObservable<number>;
        pageSize: KnockoutObservable<number>;
        items: KnockoutObservableArray<any>;
        pageButtons: KnockoutObservableArray<any>;

        firstItemOnPage: KnockoutComputed<number>;
        lastItemOnPage: KnockoutComputed<number>;
        pagedItems: KnockoutComputed<any>;

        datasource: any;
        metrics: Views.Components.Grid.GridMetrics;
        isSorting: KnockoutObservable<boolean>;

        rows: KnockoutObservable<any>;
        sortDesc: KnockoutObservable<boolean>;
        sortColumn: KnockoutObservable<any>;
        sortedRows: KnockoutComputed<any>;
        filteredRows: KnockoutComputed<any>;
        isReady: KnockoutObservable<boolean>;
        query: KnockoutObservable<string>;
        queryFilter: KnockoutComputed<any>;
        //
        exactMatchCount:KnockoutObservable<number>;
        partialMatchCount:KnockoutObservable<number>;
        //#endregion
        constructor() {
            const self = this;
            self.items = ko.observableArray();
            self.isReady = ko.observable(false);
            
            self.query = ko.observable("");
            
            self.exactMatchCount = ko.observable(0);
            self.partialMatchCount = ko.observable(0);
            
            self.queryFilter = ko.computed(() => {
                
                let temp = self.query();
                
                if (self.items().length > 0) {
                    self.items.removeAll();
                }
                if (self.datasource !== undefined) {  
                    // sort alphabetically   
                     let tempHead = new Models.SearchItemContext(null);
                     tempHead.type = Models.SearchItemContextType.Header;
                     self.items.push(tempHead);                                       
                    self.datasource.sort(function (left:Models.ISearchItemContext, right:Models.ISearchItemContext) {
                        return left.f_name == right.f_name ? 0 : (left.f_name < right.f_name ? -1 : 1)
                    });
                    // exact match: f_name
                    self.datasource.forEach((name: Models.ISearchItemContext) => {
                        let temp_f_name = name.f_name.substr(0, self.query().length);
                        if (temp_f_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                            console.log(name.f_name);
                            self.items.push(name);
                        }
                    });
                    // exact match: l_name
                    self.datasource.forEach((name: Models.ISearchItemContext) => {
                        
                        let temp_l_name = name.l_name.substr(0, self.query().length);
                        if (temp_l_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                            self.items.push(name);
                        }
                        
                    });
                    
                    self.exactMatchCount(self.items().length);   
                                     
                    self.items.push(
                        new Models.SearchItemContext(null));
                    // partial match
                    let k:number = 0;
                    self.datasource.forEach((person: Models.ISearchItemContext) => {                        
                        let temp_f_name = person.f_name.substr(
                            0, self.query().length).toLowerCase();                            
                        let temp_l_name = person.l_name.substr(
                            0, self.query().length).toLowerCase();                            
                        if (
                            temp_f_name.indexOf(self.query().toLowerCase()) === -1
                            && temp_l_name.indexOf(self.query().toLowerCase()) === -1 && 
                            person.fullname.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                            self.items.push(person);
                            k++;
                        }
                    });    
                    self.partialMatchCount(k);                 
                 }
            });
        }
        populateControl(data: any) {
            const self = this;
            console.log("hello");
            self.datasource = [];
            data.results.forEach((item: Models.ISearchItem) => {
                self.datasource.push(new Models.SearchItemContext(item));
            });
            self.isReady(true);
            //self.query.subscribe(self.search);

        }
        search(value: string) {
            const self = this;

        }
    }

    export class PageContext {
        testContext: TestContext;
        constructor() {
            const self = this;
            self.grid = new SearchContext();
            self.testContext = new TestContext();
            self.testContext.addEventListener(
                Models.Events.searchLoaded, (arg: any) => {
                    self.searchLoaded();
                });
            Q.all([self.testContext.loadSearhResults()]).then(() => {
                if (self.testContext.isLoadedSearch) {
                    self.testContext.dispatchEvent(
                        new Core.Event(
                            Models.Events.searchLoaded,
                            self.testContext.payloadSearch));
                }
            });

            self.testContext.initialize();
        }
        grid: SearchContext;
        searchLoaded() {
            const self = this;
            self.grid.populateControl(self.testContext.payloadSearch);
        }
    }
}

let appTest = new Temp.PageContext();
$(document).ready(() => {
    ko.applyBindings(this.appTest);
});
