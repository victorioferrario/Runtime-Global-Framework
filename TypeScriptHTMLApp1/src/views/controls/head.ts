/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="Components/Logo.ts" />
/// <reference path="Components/TopNav.ts" />
/// <reference path="base.ts" />
/// <reference path="../../models/IMenu.ts" />
namespace Views.Controls {
    import LogoControlProps = Views.Controls.Components.ILogoControlProps;
    export interface IHeadProps {
        payload:Models.IUserPayload;
    }
    export class Head extends Base {
        rightControl: Views.Controls.Components.RightMenu;
        logoControl: Views.Controls.Components.LogoControl;
        constructor() {
            super("topnav");
        }
        databind(data: IHeadProps) {
            const self = this;           
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
            self.rightControl = new Views.Controls.Components.RightMenu();
            self.logoControl = new Views.Controls.Components.LogoControl(logoProps);
             console.log("IHEADProps:",data);
               console.log("YOoooooooooooo")
        console.log("YOoooooooooooo")
            self.el.append(self.logoControl.render());
            self.el.append(self.rightControl.render());

            self.el.prepend(Components.Utilities.StringTemplates.dropdownMenuComponent());

            self.initTrigger();
            
        }
        render() {
            const self = this;
            

        }

        initTrigger(){
          console.log("trigger set")
            $("#button-Trigger").on("click", function(event) {
                var ddMenu = $("#dropdown");
                if (!ddMenu.hasClass("open")) {
                    ddMenu.addClass("open");
                } else {
                    ddMenu.removeClass("open");
                }
            });
        }

        toggle() {
            const self = this;
            let topBar= $(".navbar-brand"), toggleCss = "toggle-icon";
            if (!topBar.hasClass(toggleCss)) {
                topBar.addClass(toggleCss);
            } else {
              topBar.removeClass(toggleCss);
            }
        }

    }
}
