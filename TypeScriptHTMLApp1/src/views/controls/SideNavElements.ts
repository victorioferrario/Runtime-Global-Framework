namespace Views.Controls {    
    export class SideNavElements {
        toggleCss: string;
        topBar: JQuery;
        menusWrapper: JQuery;
        contentWrapper: JQuery;
        sideBarWrapper: JQuery;
        constructor() {
            const self = this;
            self.toggleCss = "toggle-icon";
            self.topBar = $(".navbar-brand");
            self.menusWrapper = $(".menus");
            self.contentWrapper = $(".static-content-wrapper");
            self.sideBarWrapper = $(".static-sidebar-wrapper");
        }
        toggle() {
            const self = this;
            if (!self.sideBarWrapper.hasClass(self.toggleCss)) {
                self.topBar.addClass(self.toggleCss);
                self.menusWrapper.addClass(self.toggleCss);
                self.contentWrapper.addClass(self.toggleCss);
                self.sideBarWrapper.addClass(self.toggleCss);
            } else {
                self.topBar.removeClass(self.toggleCss);
                self.menusWrapper.removeClass(self.toggleCss);
                self.contentWrapper.removeClass(self.toggleCss);
                self.sideBarWrapper.removeClass(self.toggleCss);
            }
        }
    }
}