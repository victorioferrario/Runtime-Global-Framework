namespace Views.Controls {
    export interface IListProps {
        index: number;
        items: Models.IMenuSegment;
    }
    export class List {
        el: JQuery;
        props: IListProps;
        controls: Array<MenuItem | any>;
        constructor(props: IListProps) {
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