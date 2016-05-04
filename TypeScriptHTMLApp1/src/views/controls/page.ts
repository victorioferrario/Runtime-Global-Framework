/// <reference path="../../../typings/tsd.d.ts" />
namespace Views {
    
    
    export class Page extends Session.BaseView {
        layout: Controls.MasterLayout;
        constructor() {
            super();
            const self = this;
            if (self.initSession()) {
                self.layout = new Controls.MasterLayout();
            }
        }
        initSession() {
            const self = this;
            self.appContext.addEventListener(
                Models.Events.dataLoaded, (arg: any) => {
                self.dataLoaded();
            });
            self.appContext.addEventListener(
                Models.Events.notificationsLoaded, (arg: any) => {
                self.dataLoaded2();
            });
            return true;
        }
        dataLoaded() {
            const self = this;
            self.layout.main.databind(
                self.appContext.payloadMenu);
            self.layout.header.databind({
                payload: self.appContext.payloadUser});
            self.init();
            Session.Trace.log("dataLoaded",self.appContext.payloadUser,self.appContext.payloadMenu);
        }
        dataLoaded2() {
            const self = this;
            self.layout.addOtherElements();
            self.layout.addNotificationPanels();
        }
        init() {
            const self = this;
          
        }
    }
    export class PageButtons {

        parent: Views.Controls.MasterLayout;
        search: JQuery;

        searchButton: JQuery;
        buttonToggle: JQuery;

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
                self.parent.header.toggle();
                self.parent.main.sideNav.toggle();
            });
            self.searchButton.on("click", (evt: any) => {
                self.search.addClass("active");
                self.parent.header.logoControl.searchControl.triggerEvent();
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
// Create loader
$(document).ready(() => {
    console.warn("ready");
    $("#layout-static .static-content-wrapper").append(
        "<div class='extrabar-underlay'></div>");
    const app = new Views.Page();
});
// Clean up loader
$(window).load(() => {
    setTimeout(() => {
        $(".page-loader").addClass("m-hide");
    }, 1900);
    setTimeout(() => {
        $(".page-content").removeClass("m-hide");
    }, 2000);
    let options = {
        html: true
    }
    for (let i = 1; i < 4; i++) {
        switch (i) {
            case 1:
                for (let k = 0; k < 5; k++) {
                    $(`#menu${i}_link${k}`).popover(options);
                }
                break;
            case 2:
                for (let k = 0; k < 4; k++) {
                    $(`#menu${i}_link${k}`).popover(options);
                }
                break;
            case 3:
                for (let k = 0; k < 1; k++) {
                    $(`#menu${i}_link${k}`).popover(options);
                }
                break;
        }
    }
});
