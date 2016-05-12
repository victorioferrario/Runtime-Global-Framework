/// <reference path="../../../../typings/tsd.d.ts" />
namespace Views.Controls.Components {
    export class SearchControl extends Session.BaseView {
        el: JQuery;
        search: JQuery;
        grid: SearchResults;
        searchButton: JQuery;
        elSearchInput: JQuery;
        elSearchWrapper: JQuery;
        elements: SearchControlElements;
        parent: Views.Controls.Components.BrandControl;
        searchResults: SearchResultsContainer;
        constructor(parent: Views.Controls.Components.BrandControl) {
            super();
            const self = this;
            self.grid = new SearchResults();
            self.parent = parent;
            self.el = $("<div/>",
                {
                    id: "search-box"
                });
            self.elSearchWrapper = $("<div/>", {
                class: "form-group is-empty"
            });
            self.elSearchInput = $("<input/>",
                {
                    id: "search-input",
                    class: "form-control",
                    placeholder: "Search...",
                    attr: {
                        "data-bind": "value: $data.layout.header.leftControl.searchControl.grid.query, valueUpdate: 'keyup'"
                    },
                    blur: (evt: any) => {
                        console.log(evt);
                    }
                });
            self.elSearchWrapper.append(
                self.elSearchInput);
            self.el.append(self.elSearchWrapper);
            $("#button-search-close").on("click", (event: Event) => {
                event.preventDefault();
            });
            ///
            // Search Container
            //
            self.searchResults = new SearchResultsContainer(self);
            self.parent.el.append(self.searchResults.render());
            //
        }

        handlerReady() {
            const self = this;
            self.grid.populateControl(
                self.appContext.payloadSearch);
            self.elements = new SearchControlElements();
        }
        render() {
            const self = this;
            return self.el;
        }
        triggerEvent() {
            const self = this;
            // Trigger hiding of all other panels or dropdowns.
            self.appContext.dispatchEvent(
                    new Core.Event(
                        Models.Events.EVENT_UI_TOGGLE_ASIDE, self));
                        
            self.appContext.dispatchEvent(
                    new Core.Event(
                        Models.Events.EVENT_UI_TOGGLE_DROPDOWN, self));
            //            
            self.grid.isDeactivated(false);            
            //
            self.elements.elementInput.focus();
            self.elements.elementDropdown.hide();
            self.elements.elementBadgeCustom.hide();
            //
            self.elements.elementTopNav.toggleClass("search-active");
            self.searchResults.el.removeClass("m-hide");            
            //
            self.elements.elementButtonClose.click((evt) => {
                //
                self.grid.isDeactivated(true);
                //
                self.el.removeClass("active");
                // 
                self.elements.elementInput.val("");
                //
                self.elements.elementPopout.removeClass("active");
                self.elements.elementBody.removeClass("search-active");
                self.elements.elementTopNav.removeClass("search-active");
                //
                self.elements.elementDropdown.show();
                self.elements.elementBadgeCustom.show();
                //
                self.searchResults.el.addClass("m-hide");
            });
        }
        closeEvent() {
            const self = this;
            //
            self.grid.isDeactivated(true);
            //
            self.el.removeClass("active");
            // 
            self.elements.elementInput.val("");
            //
            self.elements.elementPopout.removeClass("active");
            self.elements.elementBody.removeClass("search-active");
            self.elements.elementTopNav.removeClass("search-active");
            //
            self.elements.elementDropdown.show();
            self.elements.elementBadgeCustom.show();
            //
        }
        cleanEvent() {
            const self = this;
            self.elements.elementButtonClose.off("click");
        }
    }
    export class SearchControlElements {
        elementBody: JQuery;
        elementInput: JQuery;
        elementTopNav: JQuery;
        elementPopout: JQuery;
        elementDropdown: JQuery;
        elementBadgeCustom: JQuery;
        elementButtonClose: JQuery;
        constructor() {
            const self = this;
            self.elementBody = $("body");
            self.elementInput = $("#search-input");
            self.elementTopNav = $("body #topnav");
            self.elementPopout = $(".search-result-popout");
            self.elementBadgeCustom = $(".badge-custom");
            self.elementDropdown = $(".dropdown-menu-container");
            self.elementButtonClose = $("#button-search-close");
        }
    }
    export class SearchResults {

        datasource: any;

        items: KnockoutObservableArray<any>;
        totalCount: KnockoutObservable<number>;
        //                
        query: KnockoutObservable<string>;
        queryFilter: KnockoutComputed<any>;
        //
        isReady: KnockoutObservable<boolean>;

        allCount: KnockoutObservable<number>;
        exactMatchCount: KnockoutObservable<number>;
        partialMatchCount: KnockoutObservable<number>;

        isDeactivated: KnockoutObservable<boolean>;
        isAllAvailable: KnockoutObservable<boolean>;
        isExactMatchAvailable: KnockoutObservable<boolean>;
        isPartialMatchAvailable: KnockoutObservable<boolean>;

        //#endregion
        constructor() {

            const self = this;

            self.items = ko.observableArray();
            self.isReady = ko.observable(false);

            self.query = ko.observable("");

            self.allCount = ko.observable(0);
            self.exactMatchCount = ko.observable(0);
            self.partialMatchCount = ko.observable(0);


            self.isDeactivated = ko.observable(true);

            self.isAllAvailable = ko.observable(false);
            self.isExactMatchAvailable = ko.observable(false);
            self.isPartialMatchAvailable = ko.observable(false);

            self.queryFilter = ko.computed(() => {

                let temp = self.query();
                if (self.items().length > 0) {
                    self.items.removeAll();
                }
                if (!self.isDeactivated()) {
                    if (self.query().length > 0) {
                        if (self.datasource !== undefined) {
                            let tempHeadAll = new Models.SearchItemContext(null);
                            tempHeadAll.type = Models.SearchItemContextType.All;
                            self.items.push(tempHeadAll);
                            if (self.query() === "") {
                                //
                                self.isAllAvailable(true);
                                self.isExactMatchAvailable(false);
                                self.allCount(self.datasource.length);
                                //
                                self.datasource.forEach((person: Models.ISearchItemContext) => {
                                    self.items.push(person);
                                });
                                //
                                self.resetScroll();
                                //
                            } else {
                                //
                                self.resetScroll();
                                //
                                let tempHead = new Models.SearchItemContext(null);
                                tempHead.type = Models.SearchItemContextType.Header;
                                self.items.push(tempHead);
                                // sort alphabetically
                                self.datasource.sort(function (left: Models.ISearchItemContext, right: Models.ISearchItemContext) {
                                    return left.f_name == right.f_name ? 0 : (left.f_name < right.f_name ? -1 : 1)
                                });
                                if (isNaN(parseInt(temp))) {
                                    // exact match: f_name
                                    self.datasource.forEach((name: Models.ISearchItemContext) => {
                                        let f_name = name.f_name.substr(0, self.query().length);
                                        if (f_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                            self.items.push(name);
                                        }
                                    });
                                    // exact match: l_name
                                    self.datasource.forEach((name: Models.ISearchItemContext) => {
                                        let l_name = name.l_name.substr(0, self.query().length);
                                        if (l_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                            self.items.push(name);
                                        }
                                    });
                                    //
                                    self.isAllAvailable(false);
                                    self.exactMatchCount(self.items().length - 2);
                                    self.isExactMatchAvailable((self.items().length - 2) > 0);
                                    // add splitter
                                    self.items.push(new Models.SearchItemContext(null));
                                    // partial match
                                    let k: number = 0;
                                    self.datasource.forEach((person: Models.ISearchItemContext) => {
                                        let f_name = person.f_name.substr(
                                            0, self.query().length).toLowerCase();
                                        let l_name = person.l_name.substr(
                                            0, self.query().length).toLowerCase();
                                        if (
                                            f_name.indexOf(self.query().toLowerCase()) === -1
                                            && l_name.indexOf(self.query().toLowerCase()) === -1
                                            && person.fullname.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                            self.items.push(person);
                                            k++;
                                        }
                                    });
                                    self.partialMatchCount(k);
                                    self.isPartialMatchAvailable(k > 0);
                                } else {
                                    let id = parseInt(self.query());
                                    self.isExactMatchAvailable(false);
                                    //
                                    let tempHead = new Models.SearchItemContext(null);
                                    tempHead.type = Models.SearchItemContextType.SearchById;
                                    self.items.push(tempHead);
                                    //
                                    self.datasource.forEach((student: Models.ISearchItemContext) => {
                                        console.log(id, student.id, id + student.id);
                                        if (id === student.id) {
                                            self.items.push(student);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
        resetScroll() {
            $(".search-result-popout").scrollTop(0);
        }
        populateControl(data: any) {
            const self = this;
            console.log("populateControl", data);
            self.datasource = [];
            data.results.forEach((item: Models.ISearchItem) => {
                self.datasource.push(new Models.SearchItemContext(item));
            });
            self.isReady(true);
        }
        clear(data: any, event: Event) {
            const self = this;
            self.query("");
            self.resetScroll();
            event.preventDefault();
        }
        clickHandler(data: any, event: Event, action: number, id: number) {
            console.log("click", id);
            switch (action) {
                case 1:
                    console.log("load profile");
                    break;
                case 2:
                    console.log("load timeline");
                    break;
                case 3:
                    console.log("load flags");
                    break;
                case 4:
                    console.log("load cases");
                    break;
            }
        }
        search(value: string) {
            const self = this;
        }
    }
    export class SearchResultsContainer extends Session.BaseView {
        el: JQuery;
        elUl: JQuery;
        elPopout: JQuery;
        elBackground: JQuery;
        parent:SearchControl;
        constructor(parent:SearchControl) {
            super();
            const self = this;
            self.parent = parent;
            self.el = $("<article/>", {
                "class": "search-active--wrapper m-hide"
            });
            self.elPopout = $("<div/>", {
                class: "search-result-popout"
            });
            self.elUl = $("<ul/>", {
                class: "search-results",
                "data-bind": "template: { name: 'template_row_search__item', foreach: $data.layout.header.leftControl.searchControl.grid.items , as: 'person' }"
            });
            self.elBackground = $("<div/>", {
                class: "search-active-background",
                click: (evt: any) => {
                    self.parent.closeEvent();
                }
            });
            self.elPopout.append(self.elUl);
        }
        render() {
            const self = this;
            self.el.append(self.elPopout);
            self.el.append(self.elBackground);
            return self.el;
        }

    }
}