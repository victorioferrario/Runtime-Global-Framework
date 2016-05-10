/// <reference path="search.ts" />
/// <reference path="utilities/StringTemplates.ts" />
/// <reference path="../navigation/utilities/StaticElementBuilder.ts" />
/// <reference path="../../../../typings/tsd.d.ts" />
namespace Views.Controls.Components {

    export interface ILogoProps {
        alt: string;
        src: string;
        className: string;
    }
    export interface IBrandControlProps {
        className?: string;
        small?: ILogoProps;
        large?: ILogoProps;
    }

    import elementGenerator = Views.Controls.StaticElementBuilder;

    export class BrandControl {

        el: JQuery;
        lnk: JQuery;

        smallLogo: HTMLImageElement;
        largeLogo: HTMLImageElement;

        searchControl: Views.Controls.Components.SearchControl;

        constructor(props: IBrandControlProps) {

            const self = this;
            self.el = $("<div/>", {
                "class": props.className
            });
            self.lnk = $("<a/>", {
                href: "javascript:void(0);",
                "class": "navbar-brand navbar-blue"
            });
            
            self.searchControl = new Views.Controls.Components.SearchControl();

            self.smallLogo = elementGenerator.createImage(props.small);
            self.largeLogo = elementGenerator.createImage(props.large);

            self.lnk.append(self.smallLogo);
            self.lnk.append(self.largeLogo);
            

        }

        render() {
            const self = this;

            self.el.append(self.lnk);
            self.el.append(Components.Utilities.StringTemplates.toggleMenu);

            self.el.append(self.searchControl.render());
            self.el.append(Components.Utilities.StringTemplates.toggleSearch);

            return self.el;
        }
    }

}
