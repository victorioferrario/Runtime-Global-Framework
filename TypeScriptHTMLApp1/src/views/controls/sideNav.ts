/// <reference path="../../ref.d.ts" />
namespace Views {
    export class SideNavBase extends Session.BaseView {
        toggleCss: string;
        topBar: JQuery;
        menusWrapper: JQuery;
        contentWrapper: JQuery;
        sideBarWrapper: JQuery;
        constructor() {
            super();
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
        data: Models.IMenuPayload;
    }
    export class SideNav extends SideNavBase {
        nav: JQuery;
        staticColumn: JQuery;
        props: ISideNavProps;
        items: Array<Controls.Navigation.Menu | any>;
        constructor() {
            super();
            const self = this;
            self.items = [];
            self.nav = $("#nav-menu");
            self.staticColumn = $(".static-sidebar-wrapper");
            self.props = { data: self.appContext.payloadMenu };
            self.init();
        }
        init() {
            const self = this;
            let i = 1;
            self.staticColumn.prepend(
                Views.Controls.Components.Utilities.StringTemplates.profileWidget(
                    self.props.data.entity.user));
            // Initialize Segments        
            self.props.data.list.forEach((segment: Models.IMenuSegment) => {
                self.items.push(new Views.Controls.Navigation.Menu({ index: i++, items: segment }));
            });
            // Bind Segments        
            self.items.forEach((item: Views.Controls.Navigation.Menu) => {
                self.nav.append(
                    item.render());
                self.nav.append(Views.Controls.StaticElementBuilder.createMenuSplitter());
            });

        }
        initializeTooltips() {
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
        }       
        userMenuControl: Views.Controls.Components.ProfileMenu;
        render() { }
    }
}
