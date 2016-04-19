﻿namespace Views.Controls {
    export class StaticElementBuilder {
        static createIcon(props: IMenuItemProps) {
            const icon = document.createElement("i");
            icon.setAttribute("class", "material-icons menu-icon");
            icon.innerText = props.icon;
            return icon;
        }
        static createText(props: IMenuItemProps) {
            const label = document.createElement("span");
            label.setAttribute("class", "menu-text");
            label.setAttribute("title", props.label);
            label.innerText = props.label;
            return label;
        }
        static createMenuSplitter() {
            return $("<div/>", {
                 class: "menu-splitter"
            });
        }
        static createImage(props: Header.ILogoProps):HTMLImageElement {
            const image = document.createElement("img");
            image.src = props.src;
            image.setAttribute("title", props.alt);
            image.setAttribute("class", props.className);           
            return image;
        }
    }
}