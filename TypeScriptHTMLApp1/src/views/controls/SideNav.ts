namespace Views.Controls {
    export interface ISideNavProps {
        data: Models.IMenu;
    }
    export class SideNav {
        nav: JQuery;
        props: ISideNavProps;
        items: Array<Menu | any>;
        elements: SideNavElements;
        constructor(props: ISideNavProps) {
            const self = this;
            self.items = [];
            self.nav = $("#nav-menu");
            self.props= props;
            self.elements = new SideNavElements();
            self.init();
        }
        init() {
            const self = this;
            let i = 1;
            self.props.data.list.forEach((segment: Models.IMenuSegment) => {
                self.items.push(new Menu({index: i++, items: segment }));
            });
            self.items.forEach((item: Menu) => {
                self.nav.append(item.render());
                self.nav.append(
                    StaticElementBuilder.createMenuSplitter());
            });
            $("#btn-toggle").on("click", (evt: any) => {
                self.elements.toggle();
            });
        }
    }    
}