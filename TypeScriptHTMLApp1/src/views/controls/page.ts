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
            // Bind logout;            
            //     
            self.logoutButton = $("#menu3_link0");
            self.logoutButton.on("click", (evt: JQueryEventObject) => {
                self.clickHandlerLogout();
            });
            self.layout.header.leftControl.searchControl.handlerReady();
            //
            self.layout.main.sideNav.initializeTooltips();
            //
            ko.applyBindings(self);
        }
        clickHandlerLogout() {
            const self = this;
            if (self.appContext.logout()) {
                document.location.href = "/users/signout";
            }
        }
        isViewLoaded: KnockoutObservable<boolean>;
        logoutButton: JQuery;

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
