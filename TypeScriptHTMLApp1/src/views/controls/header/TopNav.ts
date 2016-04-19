namespace Views.Controls.Header {
    export class TopNav {
        el: JQuery;
        rightControl: Views.Controls.Header.RightMenu;
        logoControl: Views.Controls.Header.LogoControl;
        constructor() {
            const self = this;
            self.el = $("#topnav");
            const logoProps: ILogoControlProps = {
                className: "logo-area",
                small: {
                    alt: "Harvard",
                    src: "styles/images/h-mini.png",
                    className: "show-on-collapse img-logo-white"
                },
                large: {
                    alt: "Harvard",
                    src: "styles/images/havard-logo.png",
                    className: "img-white"
                }
            };
            self.logoControl = new LogoControl(logoProps);
            self.el.append(self.logoControl.render());

            self.rightControl = new RightMenu();
            self.el.append(self.rightControl.render());
        }
    }
    export class RightMenu {
        el: JQuery;
        constructor() {
            const self = this;
            self.el = $("<ul/>",
            {
                class: "nav navbar-nav toolbar pull-right"
            });
            self.el.append('<li class="toolbar-icon-bg appear-on-search ov-h" id="trigger-search-close"><a class="toggle-fullscreen" id="button-search-close"><span class="icon-bg"><i class="material-icons">close</i></span><div class="ripple-container"></div></a> </li>');
            self.el.append(
                Views.Controls.Header.StringTemplates.rightMenuFullScreen);

             self.el.append(
                Views.Controls.Header.StringTemplates.otherMenuItem);

            self.el.append(
                Views.Controls.Header.StringTemplates.notificationMenuItem);

        }
        render() {
            const self = this;
            $("#button-toggle-fullscreen").on("click", (event: any) => {
                console.log("this");
            });
            return self.el;
        }
        onclickFullScreen(event: any) {
            if (screenfull.enabled) {
                if (!screenfull.isFullscreen) {
                    screenfull.request();
                } else {
                    screenfull.exit();
                }
            }
        }
    }
    declare var screenfull: any;
}