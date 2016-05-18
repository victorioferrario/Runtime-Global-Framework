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
                href: props.route,
                id: props.menu + "_link" + props.index,
                class: "menu-item waves-effect waves-light",
                title: props.label,
                rel:"popover",
                attr: {
                  "data-toggle": "popover",
                  "data-placement": "right",
                  "data-content":`<div style="width:250px!important">${props.tooltip}</div>` ,
                  "data-trigger":"hover"
                },
                click: (evt: any) => {
                    //console.log("this", this);
                }
            });
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
