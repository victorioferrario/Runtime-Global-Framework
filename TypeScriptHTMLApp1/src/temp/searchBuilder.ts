// /// <reference path="../../typings/tsd.d.ts" />
// namespace Temp {
//     export class service {
//         static loadJson(url?: string): JQueryXHR {
//             return $.getJSON(url !== "" ? url : "data.json");
//         }
//     }
//     export class TestContext extends Core.EventDispatcher {
//         isLoadedSearch: boolean = false;
//         payloadSearch: Models.ISearchResults;
//         constructor() {
//             super();

//         }
//         initialize() {
//             const self = this;

//         }
//         loadSearhResults(): Q.Promise<Models.ISearchResults> {
//             const self = this;
//             Services.Http.loadJson("data-search.json").fail(() => {
//                 Q.reject("Error Loading Search");
//                 return null;
//             }).done((result: Models.ISearchResults) => {
//                 self.isLoadedSearch = true;
//                 self.payloadSearch = result;
//                 Q.resolve(result);
//             }).always(() => {
//                 return Q.resolve(self.payloadSearch);
//             });
//             return null;
//         }
//     }

//     export class SearchContext {

//         datasource: any;
        
//         items: KnockoutObservableArray<any>;
//         totalCount: KnockoutObservable<number>;
//         //                
//         query: KnockoutObservable<string>;
//         queryFilter: KnockoutComputed<any>;
//         //
//         isReady: KnockoutObservable<boolean>;

//         allCount: KnockoutObservable<number>;
//         exactMatchCount: KnockoutObservable<number>;
//         partialMatchCount: KnockoutObservable<number>;

//         isAllAvailable: KnockoutObservable<boolean>;
//         isExactMatchAvailable: KnockoutObservable<boolean>;
//         isPartialMatchAvailable: KnockoutObservable<boolean>;
        
//         //#endregion
//         constructor() {
//             const self = this;

//             self.items = ko.observableArray();
//             self.isReady = ko.observable(false);

//             self.query = ko.observable("");

//             self.allCount = ko.observable(0);
//             self.exactMatchCount = ko.observable(0);
//             self.partialMatchCount = ko.observable(0);

//             self.isAllAvailable = ko.observable(false);
//             self.isExactMatchAvailable = ko.observable(false);
//             self.isPartialMatchAvailable = ko.observable(false);

//             self.queryFilter = ko.computed(() => {
//                 let temp = self.query();
//                 if (self.items().length > 0) {
//                     self.items.removeAll();
//                 }
//                 if (self.datasource !== undefined) {
//                     let tempHeadAll = new Models.SearchItemContext(null);
//                     tempHeadAll.type = Models.SearchItemContextType.All;
//                     self.items.push(tempHeadAll);
//                     if (self.query() === "") {
//                         //
//                         self.isAllAvailable(true);
//                         self.isExactMatchAvailable(false);       
//                         self.allCount(self.datasource.length);
//                         //
//                         self.datasource.forEach((person: Models.ISearchItemContext) => {
//                             self.items.push(person);
//                         });
//                         //
//                         self.resetScroll();
//                         //
//                     } else {
//                         //
//                         self.resetScroll();
//                         //
//                         let tempHead = new Models.SearchItemContext(null);
//                         tempHead.type = Models.SearchItemContextType.Header;
//                         self.items.push(tempHead);
//                         // sort alphabetically
//                         self.datasource.sort(function (left: Models.ISearchItemContext, right: Models.ISearchItemContext) {
//                             return left.f_name == right.f_name ? 0 : (left.f_name < right.f_name ? -1 : 1)
//                         });
//                         if (isNaN(parseInt(temp))) {
//                             // exact match: f_name
//                             self.datasource.forEach((name: Models.ISearchItemContext) => {
//                                 let f_name = name.f_name.substr(0, self.query().length);
//                                 if (f_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
//                                     self.items.push(name);
//                                 }
//                             });
//                             // exact match: l_name
//                             self.datasource.forEach((name: Models.ISearchItemContext) => {
//                                 let l_name = name.l_name.substr(0, self.query().length);
//                                 if (l_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
//                                     self.items.push(name);
//                                 }
//                             });
//                             //
//                             self.isAllAvailable(false);
//                             self.exactMatchCount(self.items().length - 2);
//                             self.isExactMatchAvailable((self.items().length - 2) > 0);
//                             // add splitter
//                             self.items.push(new Models.SearchItemContext(null));
//                             // partial match
//                             let k: number = 0;
//                             self.datasource.forEach((person: Models.ISearchItemContext) => {
//                                 let f_name = person.f_name.substr(
//                                     0, self.query().length).toLowerCase();
//                                 let l_name = person.l_name.substr(
//                                     0, self.query().length).toLowerCase();
//                                 if (
//                                     f_name.indexOf(self.query().toLowerCase()) === -1 
//                                     && l_name.indexOf(self.query().toLowerCase()) === -1 
//                                     && person.fullname.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
//                                     self.items.push(person);
//                                     k++;
//                                 }
//                             });
//                             self.partialMatchCount(k);
//                             self.isPartialMatchAvailable(k > 0);
//                         } else {
//                             let id = parseInt(self.query());
//                             self.isExactMatchAvailable(false);
//                             //
//                             let tempHead = new Models.SearchItemContext(null);
//                             tempHead.type = Models.SearchItemContextType.SearchById;
//                             self.items.push(tempHead);
//                             //
//                             self.datasource.forEach((student: Models.ISearchItemContext) => {
//                                 console.log(id, student.id, id + student.id);
//                                 if (id === student.id) {
//                                     self.items.push(student);
//                                 }
//                             });
//                         }
//                     }
//                 }
//             });
//         }
//         resetScroll() {
//             $(".search-result-popout").scrollTop(0);
//         }
//         populateControl(data: any) {
//             const self = this;
//             self.datasource = [];
//             data.results.forEach((item: Models.ISearchItem) => {
//                 self.datasource.push(new Models.SearchItemContext(item));
//             });
//             self.isReady(true);
//         }
//         clear(data: any, event: Event) {
//             const self = this;
//             self.query("");
//             self.resetScroll();
//             event.preventDefault();
//         }
//         clickHandler(data: any, event: Event, action: number, id: number) {
//             console.log("click", id);
//             switch (action) {
//                 case 1:
//                     console.log("load profile");
//                     break;
//                 case 2:
//                     console.log("load timeline");
//                     break;
//                 case 3:
//                     console.log("load flags");
//                     break;
//                 case 4:
//                     console.log("load cases");
//                     break;
//             }
//         }
//         search(value: string) {
//             const self = this;
//         }
//     }

//     export class PageContext {
//         testContext: TestContext;
//         constructor() {
//             const self = this;
//             self.grid = new SearchContext();
//             self.testContext = new TestContext();
//             self.testContext.addEventListener(
//                 Models.Events.searchLoaded, (arg: any) => {
//                     self.searchLoaded();
//                 });
//             Q.all([self.testContext.loadSearhResults()]).then(() => {
//                 if (self.testContext.isLoadedSearch) {
//                     self.testContext.dispatchEvent(
//                         new Core.Event(
//                             Models.Events.searchLoaded,
//                             self.testContext.payloadSearch));
//                 }
//             });
//             self.testContext.initialize();
//         }
//         grid: SearchContext;
//         searchLoaded() {
//             const self = this;
//             self.grid.populateControl(self.testContext.payloadSearch);
//         }
//     }
// }

// let appTest = new Temp.PageContext();
// $(document).ready(() => {
//    // ko.applyBindings(this.appTest);
// });
