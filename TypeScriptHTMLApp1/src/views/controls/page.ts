namespace Views {
    export class PageButtons{
      aside1:JQuery;
      aside2:JQuery;
      elUnderlay:JQuery;
      constructor(){
        const self = this;
        self.aside1 = $(".user-aside-1");
        self.aside2 = $(".user-aside-2");

        self.init();
      }
      init(){
        const self = this;
        console.log(self);

      }
      toggle(isAlerts:boolean){
        const self = this;
        console.log(isAlerts);
          self.elUnderlay = $(".extrabar-underlay");
        switch(isAlerts){
          case true:
            if(!self.aside2.hasClass("toggle-aside")){
                self.aside1.removeClass("toggle-aside");
                self.aside2.addClass("toggle-aside");
                self.elUnderlay.addClass("toggle-aside");
            }else{
              self.aside2.removeClass("toggle-aside");
              self.elUnderlay.removeClass("toggle-aside");
            }
          break;
          case false:
            if(!self.aside1.hasClass("toggle-aside")){
                self.aside2.removeClass("toggle-aside");
                self.aside1.addClass("toggle-aside");
                self.elUnderlay.addClass("toggle-aside");
            }else{
              self.aside1.removeClass("toggle-aside");
              self.elUnderlay.removeClass("toggle-aside");
            }
          break;
        }
      }
      hide(){
        const self = this;
        self.aside1.removeClass("toggle-aside");
        self.aside2.removeClass("toggle-aside");
        self.elUnderlay.removeClass("toggle-aside");
      }
    }
    export class Page {
        notificationPanel:PageButtons;
        layout: Controls.MasterLayout;
        progressReports:Views.Controls.Components.ProgressReports;
        appContext: Session.AppContext;
        constructor() {
            const self = this;
            self.layout = new Controls.MasterLayout();
            self.notificationPanel = new PageButtons();
            self.appContext = Session.AppContext.getInstance();
            self.appContext.addEventListener(
                Models.Events.dataLoaded, (arg: any) => {
                    self.dataLoaded();
                });
            self.appContext.addEventListener(
                Models.Events.notificationsLoaded, (arg:any) =>{
                    self.dataLoaded2();
            });
        }
        dataLoaded() {
            const self = this;
            console.log("dataLoaded");
            self.layout.main.databind(
                self.appContext.payloadMenu);
                self.layout.header.databind({
                    payload: self.appContext.payloadUser
                });
            self.init();
        }
        dataLoaded2() {
            const self = this;

            self.progressReports = new Views.Controls.Components.ProgressReports(self.appContext.payloadNotifications);
        }
        init() {
            const self = this;
            $("#btn-toggle").on("click", (evt: any) => {
                 self.layout.header.toggle();
                 self.layout.main.sideNav.toggle();
            });
            self.search = $("#search-box");
            self.searchButton = $("#trigger-search");
            self.searchButton.on("click", (evt: any) => {
                self.search.addClass("active");
                self.layout.header.logoControl.searchControl.triggerEvent();
            });
            //buttonCloseProgressReports|buttonCloseAlerts
            $("#button-toggle-aside_Notifications").on("click",(evt:any)=>{
              console.log(self);
                self.notificationPanel.toggle(true);
            });
            $("#button-toggle-aside_ProgressReports").on("click",(evt:any)=>{
                self.notificationPanel.toggle(false);
            });
            $("#buttonCloseProgressReports").on("click",(evt:any)=>{
                self.notificationPanel.hide();
            });
            $("#buttonCloseAlerts").on("click",(evt:any)=>{
                self.notificationPanel.hide();
            });

            $("#user-menu-expand").on("click",(evt:any)=>{
              let userMenu =$(".user-menu");
              if(!userMenu.hasClass("expanded")){
                userMenu.addClass("expanded");
                $("#user-menu-collapse").removeClass("m-hide-opacity");
                $("#user-menu-expand").addClass("m-hide-opacity");
              }else{
                userMenu.removeClass("expanded");
                $("#user-menu-collapse").addClass("m-hide-opacity");
                $("#user-menu-expand").removeClass("m-hide-opacity");
              }
            });
            $("#user-menu-collapse").on("click",(evt:any)=>{
              let userMenu =$(".user-menu");
              if(!userMenu.hasClass("expanded")){
                userMenu.addClass("expanded");
                $("#user-menu-collapse").removeClass("m-hide-opacity");
                $("#user-menu-expand").addClass("m-hide-opacity");
              }else{
                userMenu.removeClass("expanded");
                $("#user-menu-collapse").addClass("m-hide-opacity");
                $("#user-menu-expand").removeClass("m-hide-opacity");
              }
            });

        }
        search:JQuery;
        searchButton:JQuery;
    }
}
declare var screenfull: any;
var toggleFullScreen = () => {
    console.log("toooooooooooooooooo");
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
