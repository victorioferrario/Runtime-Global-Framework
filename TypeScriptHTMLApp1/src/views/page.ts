namespace Views {

    export class Page {
        search: JQuery;
        searchButton: JQuery;

        sideNav: Views.Controls.SideNav;
        topNav: Views.Controls.Header.TopNav;

        appContext: Session.AppContext;

        constructor() {
            const self = this;
            self.appContext = Session.AppContext.getInstance();
            self.appContext.addEventListener(
                Models.Events.dataLoaded, (arg: any) => {
                    self.dataLoaded(arg);
                });
        }
        dataLoaded(arg: any) {
            const self = this;
            self.topNav = new Views.Controls.Header.TopNav();
            self.sideNav = new Views.Controls.SideNav(
                {
                    data: self.appContext.data

                }
            );
            self.init();
        }
        init() {
            const self = this;
            self.search = $("#search-box");
            self.searchButton = $("#trigger-search");
            self.searchButton.on("click", (evt: any) => {
                self.search.addClass("active");
                console.log(window.innerWidth);
                self.topNav.logoControl.searchControl.triggerEvent();
            });
             $("#button-fullscreen").on("click", (evt: any) => {
                 console.log("hello fullscreen");

             });
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
});
