/// <reference path="../../../typings/tsd.d.ts" />
namespace Views {

    export class Page extends Session.BaseView {

        title: KnockoutObservable<string>;
        layout: Controls.MasterLayout;

        constructor() {
            super();
            const self = this;
            if (self.init()) {
                self.isViewLoaded = ko.observable(false);
                self.layout = new Controls.MasterLayout();
            }
        }

        init() {
            const self = this;
            self.appContext.addEventListener(
                Models.Events.dataLoaded, (arg: any) => {
                    self.dataLoaded();
                });
            self.appContext.addEventListener(
                Models.Events.notificationsLoaded, (arg: any) => {
                    self.dataLoaded2();
                });
            self.appContext.addEventListener(
                Models.Events.searchLoaded, (arg: any) => {
                    self.searchLoaded();
                });
            return true;
        }

        //Responses.
        isEventCalled_DataLoaded: boolean = false;
        //        
        dataLoaded() {
            const self = this;            
            self.layout.databind(
                self.appContext.payloadMenu,
                self.appContext.payloadUser);
        }
        //
        dataLoaded2() {
            const self = this;            
            self.layout.addProfilePanel();
            self.layout.addNotificationPanels();            
        }
        // Search
        searchLoaded() {
            const self = this;
            //            
            self.layout.header.leftControl.searchControl.handlerReady();
            //
            self.layout.main.sideNav.initializeTooltips();
            //
            ko.applyBindings(self);
        }
        isViewLoaded: KnockoutObservable<boolean>;
    }

    export class SearchContext extends Session.BaseView {

        constructor() {
            super(); this.createChildControls();
        }

        databind() {
            const self = this;
            // self.appContext.payloadSearch.results.filter()
        }

        createChildControls() {
            const self = this;

            $("#q").focus(function () {
                $(".search-result-popout").addClass("active");
                $("body").addClass("search-active")
            });
            $(".search-active-background").click(function () {
                $(".search-result-popout").removeClass("active");
                $("body").removeClass("search-active")
            });
            
        }

    }

    // ToDo: Re-factor this entire object. Most likely go down a namespace. Class name is wrong. The elements seem to be assosicated to search.
    export class PageButtons {
        search: JQuery;
        searchButton: JQuery;
        buttonToggle: JQuery;
        parent: Views.Controls.MasterLayout;
        constructor(ref: Views.Controls.MasterLayout) {
            const self = this;
            self.parent = ref;
            self.search = $("#search-box");
            self.searchButton = $("#trigger-search");
            self.buttonToggle = $("#btn-toggle");            
            self.init();
        }
        init() {
            const self = this;
            self.buttonToggle.on("click", (evt: any) => {
                self.parent.toggle();
            });
            self.searchButton.on("click", (evt: any) => {
                self.search.addClass("active");
                $("body").addClass("search-active");
                $(".search-result-popout").addClass("active");
                self.parent.header.leftControl.searchControl.triggerEvent();
            });
        }
    }
}

declare var screenfull: any;
var toggleFullScreen = () => {
    if (screenfull.enabled) {
        if (!screenfull.isFullscreen) {
            screenfull.request();
        } else {
            screenfull.exit();
        }
    }
}

var onClickTest = function () {
    console.log("test");
}
$(document).ready(() => {
    console.warn("ready");
    $("#layout-static .static-content-wrapper").append(
        "<div class='extrabar-underlay'></div>");

    const app = new Views.Page();

    $("#q").focus(function () {
        $(".search-result-popout").addClass("active");
        $("body").addClass("search-active")
    });
    $(".search-active-background").click(function () {
        $(".search-result-popout").removeClass("active");
        $("body").removeClass("search-active")
    }); 
});
// // Clean up loader
$(window).load(() => {
    setTimeout(() => {
        $('.page-loader').addClass('fadeOut animated-500').on('webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', function () {
            $(".page-loader").remove();
             $(".page-content").removeClass("m-hide");
        });
    }, 2000);
    // Pop overs
    
});
