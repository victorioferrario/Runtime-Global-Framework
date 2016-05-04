/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="Components/Logo.ts" />
/// <reference path="Components/TopNav.ts" />
/// <reference path="../../Session/base.ts" />
/// <reference path="../../models/IMenu.ts" />
namespace Views.Controls {
    import LogoControlProps = Views.Controls.Components.ILogoControlProps;
    export interface IHeadProps {
        payload: Models.IUserPayload;
    }
    export class Head extends Session.Base {
        rightControl: Views.Controls.Components.RightMenu;
        logoControl: Views.Controls.Components.LogoControl;
        constructor() {
            super("topnav");
        }
        databind(data: IHeadProps) {
            const self = this;
            console.warn("head", data)
            const logoProps: LogoControlProps = {
                className: "logo-area",
                small: {
                    alt: data.payload.entity.logos[0].alt,
                    src: data.payload.entity.logos[0].src,
                    className: data.payload.entity.logos[0].className
                },
                large: {
                    alt: data.payload.entity.logos[1].alt,
                    src: data.payload.entity.logos[1].src,
                    className: data.payload.entity.logos[1].className
                }
            };
            self.rightControl
                = new Views.Controls.Components.RightMenu();

            self.logoControl
                = new Views.Controls.Components.LogoControl(
                    logoProps);

            self.el.append(self.logoControl.render());
            self.el.append(self.rightControl.render());

            self.el.prepend(Components.Utilities.StringTemplates.dropdownMenuComponent());
            self.ddMenu = $("#dropdown");
            self.ddMenuTrigger = $("#button-Trigger");
            self.ddMenuBackground = $(".dropdown-close-background");
            self.initTrigger();

        }
        render() {
            const self = this;
        }
        ddMenu: JQuery;
        ddMenuTrigger: JQuery;
        ddMenuBackground: JQuery;
        initTrigger() {
            const self = this;
            const jqueryArray = [
                self.ddMenu,
                self.ddMenuTrigger,
                self.ddMenuBackground];
            self.ddMenuTrigger.on("click", (event) => {
                if (!self.ddMenu.hasClass("open")) {
                    self.toggleArrayClass(true, jqueryArray, "open");
                    setTimeout(() => {
                        self.ddMenuBackground.on("mouseenter", (evt: any) => {
                            self.toggleArrayClass(false, jqueryArray, "open");
                        });
                    }, 1000);
                } else {
                    self.ddMenuBackground.off( "mouseenter", () => {
                        console.log("offfff")
                    } );
                    self.toggleArrayClass(false, jqueryArray, "open");
                }
            });


        }
        toggleArrayClass(direction: boolean, items: Array<JQuery>, cssClass: string) {
            items.forEach((item: JQuery) => {
                if (direction) {
                    item.addClass(cssClass);
                } else {
                    item.removeClass(cssClass);
                }
            });
        }

        toggle() {
            const self = this;
            let topBar = $(".navbar-brand"), toggleCss = "toggle-icon";
            if (!topBar.hasClass(toggleCss)) {
                topBar.addClass(toggleCss);
            } else {
                topBar.removeClass(toggleCss);
            }
        }

    }
}
