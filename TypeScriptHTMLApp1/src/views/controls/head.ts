/// <reference path="../../ref.d.ts" />
///** Head                                  **\\\
namespace Views.Controls {
    export interface IHeadProps {
        payload: Models.IUserPayload;
    }

    export class DropdownControl extends Session.BaseView {

        ddMenu: JQuery;
        ddMenuTrigger: JQuery;
        ddMenuBackground: JQuery;

        static htmlPayload: string = Components.Utilities.StringTemplates.dropdownMenuComponent();

        constructor(public parent: JQuery) {
            super();
            const self = this;
            parent.append(DropdownControl.htmlPayload);
            //
            self.appContext.addEventListener(
                Models.Events.EVENT_UI_TOGGLE_ASIDE, () => {
                    self.closeEvent();
                });
            //
            self.init();
        }

        init() {
            const self = this;
            self.ddMenu = $("#dropdown");
            self.ddMenuTrigger = $("#button-Trigger");
            self.ddMenuBackground = $(".dropdown-close-background");
            // 

            //
            self.trigger();
        }

        trigger() {
            const self = this;
            const jqueryArray = [
                self.ddMenu,
                self.ddMenuTrigger,
                self.ddMenuBackground];
            self.ddMenuTrigger.on("click", (event) => {
                if (!self.ddMenu.hasClass("open")) {
                    //
                    self.appContext.dispatchEvent(
                        new Core.Event(
                            Models.Events.EVENT_UI_TOGGLE_DROPDOWN, self));
                    //
                    self.toggleArrayClass(true, jqueryArray, "open");
                    //
                    setTimeout(() => {
                        self.ddMenuBackground.on("mouseenter", (evt: any) => {
                            self.toggleArrayClass(false, jqueryArray, "open");
                        });
                    }, 1000);
                } else {
                    self.ddMenuBackground.off("mouseenter", () => { });
                    self.toggleArrayClass(false, jqueryArray, "open");
                }
            });
        }
        closeEvent() {
            const self = this;
            const jqueryArray = [
                self.ddMenu,
                self.ddMenuTrigger,
                self.ddMenuBackground];
            self.toggleArrayClass(
                false, jqueryArray, "open");
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

    }
    export class Head extends Session.Base {

        dropControl: DropdownControl;
        leftControl: Views.Controls.Components.BrandControl;
        rightControl: Views.Controls.Components.RightMenu;

        constructor() {
            super("topnav");
            const self = this;

        }

        databind() {
            const self = this;
            const data = self.appContext.payloadUser;
            const logoProps: Views.Controls.Components.IBrandControlProps = {
                className: "logo-area",
                small: {
                    alt: data.entity.logos[0].alt,
                    src: data.entity.logos[0].src,
                    className: data.entity.logos[0].className
                },
                large: {
                    alt: data.entity.logos[1].alt,
                    src: data.entity.logos[1].src,
                    className: data.entity.logos[1].className
                }
            };

            // RightControl
            self.rightControl
                = new Views.Controls.Components.RightMenu();

            self.el.append(
                self.rightControl.render());

            // LeftControl
            self.leftControl
                = new Views.Controls.Components.BrandControl(logoProps);

            self.el.append(
                self.leftControl.render());

            // Department switcher menu.

            self.dropControl = new DropdownControl(self.el);
        }

        render() {
            const self = this;
        }
        toggle() {
            const self = this;
            let topBar = $(".navbar-brand"),
                toggleCss = "toggle-icon";
            if (!topBar.hasClass(toggleCss)) {
                topBar.addClass(toggleCss);
            } else {
                topBar.removeClass(toggleCss);
            }
        }

    }
}
