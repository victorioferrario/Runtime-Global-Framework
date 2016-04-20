namespace Views.Controls.Navigation {
    export interface IMenuProps {
        index: number;
        items: Models.IMenuSegment;
    }
    export class Menu {
        el: JQuery;
        props: IMenuProps;
        controls: Array<MenuItem | any>;
        constructor(props: IMenuProps) {
            const self = this;
            self.props = props;
            self.controls = [];
        }
        render() {
            const self = this;
            self.el = $("<div/>", {
                id: `menu${self.props.index}`
            });
            let k = 0;
            self.props.items.data.forEach((item: Models.IMenuItem) => {
                const prop: IMenuItemProps = item;
                prop.index = k++;
                prop.menu = `menu${self.props.index}`;
                self.controls.push(new MenuItem(prop));
            });
            self.controls.forEach((lnk: MenuItem) => {
                self.el.append(lnk.render());
            });
            return self.el;
        }
    }
}