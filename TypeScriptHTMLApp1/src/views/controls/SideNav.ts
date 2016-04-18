namespace Views.Controls {
    export interface ISideNavProps {
        data: Models.IMenu;
    }
    export class SideNav {
        nav: JQuery;
        props: ISideNavProps;
        items: Array<List | any>;
        elements: SideNavElements;
        constructor(props: ISideNavProps) {
            const self = this;
            self.items = [];
            self.nav = $("#nav-menu");
            self.props= props;
            self.elements
                = new SideNavElements();
            self.init();
        }
        init() {
            const self = this;
            let i = 1;
            self.props.data.list.forEach((segment: Models.IMenuSegment) => {
                self.items.push(new List({
                    index: i++,
                    items: segment
                }));
            });
            self.items.forEach((item: List) => {
                self.nav.append(
                    item.render());
                self.nav.append(
                    StaticElementBuilder.createMenuSplitter());
            });
            $("#btn-toggle").on("click", (evt: any) => {
                self.elements.toggle();
            });
        }
    }
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