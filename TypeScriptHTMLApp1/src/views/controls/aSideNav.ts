namespace Views {
    export class SideNavBase {
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
    export interface ISideNavProps {
        data: Models.IMenu;
    }
    export class SideNav extends SideNavBase {
        nav: JQuery;
        props: ISideNavProps;
        items: Array<Controls.Navigation.Menu | any>;
        constructor() {
            super();
            const self = this;
            self.items = [];
            self.nav = $("#nav-menu");
        }
        init(props: Models.IMenu) {
            const self = this;
            self.props = { data: props };
            let i = 1;

            self.nav.append(
                Views.Controls.Components.Utilities.StringTemplates.profileWidget());
            // build menu
            self.props.data.list.forEach((segment: Models.IMenuSegment) => {
                self.items.push(new  Views.Controls.Navigation.Menu({index: i++, items: segment }));
            });
            self.items.forEach((item:  Views.Controls.Navigation.Menu) => {
                self.nav.append(item.render());
                self.nav.append( Views.Controls.StaticElementBuilder.createMenuSplitter());
            });
        }
    } 
}

            
          