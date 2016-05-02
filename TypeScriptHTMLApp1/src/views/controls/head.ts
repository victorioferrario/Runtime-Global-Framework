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
            self.render();
        }
        render() {
            const self = this;
            self.el.append(self.logoControl.render());
            self.el.append(self.rightControl.render());
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
