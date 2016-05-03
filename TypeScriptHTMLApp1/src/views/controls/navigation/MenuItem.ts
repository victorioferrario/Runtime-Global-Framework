namespace Views.Controls {
    export interface IMenuItemProps {
        icon: string;
        label: string;
        route: string;
        index?: number;
        menu?: string;
        tooltip: string;
    }
    export class MenuItem {
        icon: HTMLElement;
        label: HTMLElement;
        control: JQuery;
        constructor(public props: IMenuItemProps) {
            const self = this;
            self.control = $("<a/>", {
                href: "javascript:void(0)",
                id: props.menu + "_link" + props.index,
                class: "menu-item waves-effect waves-light",
                title: props.tooltip,
                attr: {
                    "data-toggle": "tooltip",
                    "data-placement": "bottom"
                },
                click: (evt: any) => {
                    console.log("this", this);
                }
            });
            //self.control.attr("data-toggle", "tooltip");
            //self.control.attr("data-placement", "right");
            self.control
                .append(StaticElementBuilder.createIcon(props))
                .append(StaticElementBuilder.createText(props));
        }
        render() {
            const self = this;
            return self.control;
        }
    }
}