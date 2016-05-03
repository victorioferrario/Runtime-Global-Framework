﻿namespace Views {
    export class AsideButtons {
        parent: AsideControl;
        buttonCloseAlerts: JQuery;
        buttonToggleAlerts: JQuery;
        buttonCloseReports: JQuery;
        buttonToggleReports: JQuery;
        constructor(ref: AsideControl) {
            const self = this;
            self.parent = ref;
            // Alerts   
            self.buttonCloseAlerts = $("#buttonCloseAlerts");
            self.buttonToggleAlerts = $("#button-toggle-aside_Notifications");
            // Progress Reports
            self.buttonCloseReports = $("#buttonCloseProgressReports");
            self.buttonToggleReports = $("#button-toggle-aside_ProgressReports");
            self.init();
        }
        init() {
            const self = this;
            self.buttonCloseAlerts.on("click", (evt: any) => {
                self.parent.hide();
            });
            self.buttonCloseReports.on("click", (evt: any) => {
                self.parent.hide();
            });
            self.buttonToggleAlerts.on("click", (evt: any) => {
                self.parent.toggle(false);
            });
            self.buttonToggleReports.on("click", (evt: any) => {
                self.parent.toggle(true);
            });
        }
    }
    export class AsideControl {

        aside1: JQuery;
        aside2: JQuery;
        elUnderlay: JQuery;
        buttons: AsideButtons;

        static cssToggle: string = "toggle-aside";

        constructor() {
            const self = this;
            self.aside1 = $(".user-aside-1");
            self.aside2 = $(".user-aside-2");
            self.init();
        }

        init() {
            const self = this;
            self.buttons = new AsideButtons(self);
            self.elUnderlay = $(".extrabar-underlay");
        }
        hide() {
            const self = this;
            self.aside1.removeClass(AsideControl.cssToggle);
            self.aside2.removeClass(AsideControl.cssToggle);
            self.elUnderlay.removeClass(AsideControl.cssToggle);
        }
        toggle(isAlerts: boolean) {
            const self = this;
            switch (isAlerts) {
                case true:
                    self.toggleStatic(self.aside2, self.aside1, self.elUnderlay);
                    break;
                case false:
                    self.toggleStatic(self.aside1, self.aside2, self.elUnderlay);
                    break;
            }
        }
        toggleStatic(asideToShow: JQuery, asideToHide: JQuery, asideUnderlay: JQuery) {
            if (!asideToShow.hasClass(AsideControl.cssToggle)) {
                asideToShow.addClass(AsideControl.cssToggle);
                asideUnderlay.addClass(AsideControl.cssToggle);
                asideToHide.removeClass(AsideControl.cssToggle);
            } else {
                asideToShow.removeClass(AsideControl.cssToggle);
                asideUnderlay.removeClass(AsideControl.cssToggle);
            }
        }
    }
    
    export class Page {
        asideControl: AsideControl;
        layout: Controls.MasterLayout;
        appContext: Session.AppContext;
        pageButtons:PageButtons;
        userMenuControl: Views.Controls.Components.UserMenu;
        alerts: Controls.Components.Alerts;
        progressReports: Controls.Components.ProgressReports;
        constructor() {
            const self = this;
            self.layout = new Controls.MasterLayout();
            // AppContext Init
            self.appContext = Session.AppContext.getInstance();
            self.appContext.addEventListener(Models.Events.dataLoaded, (arg: any) => {
                self.dataLoaded();
            });
            self.appContext.addEventListener(Models.Events.notificationsLoaded, (arg: any) => {
                self.dataLoaded2();
            });
        }
        dataLoaded() {
            const self = this;
            self.layout.main.databind(
                self.appContext.payloadMenu);
            self.layout.header.databind({
                payload: self.appContext.payloadUser
            });
            self.init();
        }
        dataLoaded2() {
            const self = this;

            self.asideControl = new AsideControl();
            self.alerts = new Views.Controls.Components.Alerts(self.appContext.payloadNotifications);
            self.progressReports = new Views.Controls.Components.ProgressReports(self.appContext.payloadNotifications);
        }
        init() {
            const self = this;
            self.pageButtons = new PageButtons(self);
            self.userMenuControl = new Views.Controls.Components.UserMenu();
            setTimeout(() => {
                $('[data-toggle="tooltip"]').tooltip();
                console.log("set bootstrap tooltip")
            }, 2000);
        }
    }
    export class PageButtons {
        search: JQuery;
        searchButton: JQuery;
        buttonToggle: JQuery;
        parent:Page;
        constructor(ref: Page) {
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
                self.parent.layout.header.toggle();
                self.parent.layout.main.sideNav.toggle();
            });
            self.searchButton.on("click", (evt: any) => {
                self.search.addClass("active");
                self.parent.layout.header.logoControl.searchControl.triggerEvent();
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

$(document).ready(() => {
    const app = new Views.Page();
    $("#layout-static .static-content-wrapper").append(
        "<div class='extrabar-underlay'></div>");
    
});