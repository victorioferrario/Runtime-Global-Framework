/// <reference path="../../../../../typings/tsd.d.ts" />
namespace Views.Components.Grid {
    export class StaticGridEvents {
        static ready = "event:grid:ready";
    }
    export class GridViewModel extends Session.Base {

        datasource: Models.ISearchResults;

        constructor() {
            super("gridView");
            const self = this;
            self.isLoaded = ko.observable(false);
        }
        
        databind() {
            console.log("search:databind");
            const self = this;
            
            self.datasource = self.appContext.payloadSearch;
            
            if (self.createChildControls()) {
                console.log("databind:before:dispatchEvent") ;             
                self.dispatchEvent(
                    new Core.Event(StaticGridEvents.ready, 
                        self.appContext.payloadSearch));                  
            }
        }
        createChildControls() {

            const self = this;           
            
            self.metrics = new GridMetrics(
                self.datasource.results.length);

            self.contextSearch = ko.observable("");

            self.items = ko.observableArray([]);

            self.isSorting
                = ko.observable(false);

            self.sortColumn
                = ko.observable("Name");

            self.pageSize = ko.observable(
                self.metrics.limit);

            self.totalCount = ko.observable(
                self.metrics.totalCount);

            self.totalPages = ko.observable(
                self.metrics.totalPages);

            self.currentPage = ko.observable(0);

            self.itemsPerPageCount = ko.observable(10);            
            self.pageButtons = ko.observableArray([]);           
                        
            for (var i = 0; i < self.totalPages(); i++) {
                self.pageButtons.push(
                    new GridPagerButton(self.currentPage(), i + 1));
            }
            self.pageButtons().forEach((item:GridPagerButton)=>{
                console.log(item);
            });
            
            self.isLoaded(true);
               
            console.log("set is loaded", self.isLoaded())
                     
            self.watchItemsPerPageCount = ko.pureComputed(() => {                
                self.metrics.update(self.itemsPerPageCount());
                return " " + self.itemsPerPageCount().toString();
                
            }).extend({
                notify: 'always'
            });
            
            self.isBack = ko.pureComputed(() =>
                self.currentPage() > 1 ? "" : "disabled", self);
                
            self.isNext = ko.computed(() =>
                self.currentPage() === self.totalPages() ? "disabled" : "en", self);

            self.firstItemOnPage = ko.computed(() =>
                (self.currentPage() - 1) * self.pageSize() + 1);
            self.lastItemOnPage = ko.computed(() => {
                var num = self.firstItemOnPage() + self.pageSize() - 1;
                return num > self.totalCount() ? self.totalCount() : num;
            });

            self.pagedItems = ko.computed(() => {
                if (!self.isSorting()) {
                    return self.datasource.results.slice(self.firstItemOnPage() - 1, self.lastItemOnPage());
                } else {
                    return self.filteredRows().slice(self.firstItemOnPage() - 1, self.lastItemOnPage());
                }
            });
            console.log("self.datasource.results",self.datasource.results);
            self.filteredRows = ko.computed(() => {
                var tttt = typeof self.datasource.results !== "function" ? self.datasource.results : this.datasource.results;
                var rows = tttt,
                    search = self.contextSearch().toLowerCase();
                if (search === '') {
                    $("#pagerButton-Container").show();
                    return rows.slice();
                }
                if (search !== '') {
                    self.currentPage(1);
                    $("#pagerButton-Container").hide();
                }                
                return ko.utils.arrayFilter(rows, function (row:any) {
                    var v = row["f_name"];
                    v = ko.unwrap(v);
                    if (v) {
                        if ($.isNumeric(v)) {
                            if (v === search)
                                return true;
                        }
                        else if (Date.parse(v)) {
                            if (Date.parse(v) === Date.parse(search))
                                return true;
                        }
                        else if (v.toString().toLowerCase().indexOf(search) >= 0) {
                            this.currentPage();
                            return true;
                        }
                    }
                    return false;
                });
            }).extend({ throttle: 1 });
            
            console.log("self.filteredRows ",self.filteredRows());          
             
            
            
            self.isFirstSort = ko.observable(0);
            self.sortedRows = ko.computed(() => {
                self.pageSize(self.metrics.limit);
                self.totalCount(self.metrics.totalCount);
                self.totalPages(self.metrics.totalPages);
                let sorted = self.filteredRows().slice(), //We don't want to be sorting the original list
                    sortDirection = self.sortDesc() ? 1 : -1,
                    sortProperty = self.sortColumn() || "";
                if (sortProperty === "") {
                    return sorted;
                }
                let sort = (a:any, b:any) => self.standardSort(a, b, sortProperty) * sortDirection;
                
                return sorted.sort(sort);   
                             
            }).extend({ throttle: 10 });       
            
                 console.log("self.filteredRows ",self.sortedRows());     
                 
            self.rows = ko.computed({
                read: () => {
                    var sortedRows = self.sortedRows();
                    return sortedRows.slice(
                        self.firstItemOnPage() - 1, self.lastItemOnPage());
                },
                deferEvaluation: true
            });
            console.log("self.sortedRows",self.sortedRows());
            
            console.log("self.datasource.results",self.rows());
            
            self.sortColumn("f_name");

            
            return true;
        }

        standardSort (a:any, b:any, sortProperty:any) {
                var propA = ko.unwrap(a[sortProperty]),
                    propB = ko.unwrap(b[sortProperty]);
                if (propA === propB)
                    return 0;
                return propA < propB ? 1 : -1;
            };
        contextSearch: KnockoutObservable<string>;
        itemsPerPageCount: KnockoutObservable<number>;

        metrics: IGridMetrics;
        rows: KnockoutObservable<any>;
        items: KnockoutObservableArray<any>;

        pageSize: KnockoutObservable<number>;
        isSorting: KnockoutObservable<boolean>;
        totalCount: KnockoutObservable<number>;
        totalPages: KnockoutObservable<number>;
        currentPage: KnockoutObservable<number>;
        pageButtons: KnockoutObservableArray<any>;

        sortColumn: KnockoutObservable<any>;
        sortDesc: KnockoutObservable<boolean>;
        
        isLoaded:KnockoutObservable<boolean>;       
       

        isBack: KnockoutComputed<string>;
        isNext: KnockoutComputed<string>;

        sortedRows: KnockoutComputed<any>;
        pagedItems: KnockoutComputed<any>;
        filteredRows: KnockoutComputed<any>;
        isFirstSort: KnockoutObservable<number>;
        lastItemOnPage: KnockoutComputed<number>;
        firstItemOnPage: KnockoutComputed<number>;
        watchItemsPerPageCount: KnockoutComputed<string>;
        searchTitle:KnockoutObservable<string>;        
    }

    export class GridView extends GridViewModel {

         
        constructor() {
            super();
            const self = this;
            self.searchTitle = ko.observable("Search Title");           
                    
        }

        handlerReady() {
            console.log("ready");            
            const self = this;   
                        
            
         
        }        
        onSortCommand(column: string) {
            var self = this;
            self.currentPage(1);
            self.isSorting(true);
            if (self.sortDesc()) {
                self.sortColumn(column);
                self.sortDesc(false);
            } else {
                self.sortDesc(true);
                self.sortColumn(column);
            }
            self.updateView(self.currentPage());
        }
        getSortColumn(instance: string) {
            var self = this;
            return self.sortColumn() === instance;
        }
        updateView(index:number) {
            var self = this;
            self.currentPage(index);
            ko.utils.arrayForEach(self.pageButtons(), (item: GridPagerButton) => {
                item.pageIndex(index);
            });
        }
        getColumn: (name: string, value: KnockoutObservable<boolean>) => any;
    }
} 