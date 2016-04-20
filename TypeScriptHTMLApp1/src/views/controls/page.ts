namespace Views {
    export class Page {
        layout: Controls.MasterLayout;
        appContext: Session.AppContext;
        constructor() {
            const self = this;
            self.layout = new Controls.MasterLayout();
            self.appContext = Session.AppContext.getInstance();
            self.appContext.addEventListener(
                Models.Events.dataLoaded, (arg: any) => {
                    self.dataLoaded();
                });
        }
        dataLoaded() {
            const self = this;
            self.layout.main.databind(self.appContext.payload);
            self.layout.header.databind({
                payload: self.appContext.payload.entity
            });
            self.init();
        }
        init() {
            const self = this;
            $("#btn-toggle").on("click", (evt: any) => {
                 self.layout.header.toggle();
                self.layout.main.sideNav.toggle();
            });
            //const self = this;
            //self.search = $("#search-box");
            //self.searchButton = $("#trigger-search");
            //self.searchButton.on("click", (evt: any) => {
            //    self.search.addClass("active");
            //    console.log(window.innerWidth);
            //    self.topNav.logoControl.searchControl.triggerEvent();
            //});
            //$("#button-fullscreen").on("click", (evt: any) => {
            //    console.log("hello fullscreen");
            //});
        }
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
