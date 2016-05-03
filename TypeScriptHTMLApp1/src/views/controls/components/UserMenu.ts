namespace Views.Controls.Components {
    export class UserMenu {
        menu = $(".user-menu");
        menuOpen: JQuery;
        menuClose: JQuery;
        static cssExp = "expanded";
        static cssHide = "m-hide-opacity";
        constructor() {
            const self = this;
            self.menuOpen = $("#user-menu-expand");
            self.menuClose = $("#user-menu-collapse");
            self.init();
        }
        init() {
            const self = this;
            self.menuOpen.on("click", (evt: any) => {
                console.log(this);
                UserMenu.toggleState(self.menuClose, self.menuOpen, self.menu);
            });
            self.menuClose.on("click", (evt: any) => {
                console.log(this);
                UserMenu.toggleState(self.menuOpen, self.menuClose, self.menu);
            });
        }
        static toggleState(linkToShow: JQuery, linkToHide: JQuery, menu: JQuery) {
            if (!menu.hasClass(UserMenu.cssExp)) {
                menu.addClass(UserMenu.cssExp);
                linkToHide.addClass(UserMenu.cssHide);
                linkToShow.removeClass(UserMenu.cssHide);
            } else {
                menu.removeClass(UserMenu.cssExp);
                linkToHide.removeClass(UserMenu.cssHide);
                linkToShow.addClass(UserMenu.cssHide);
            }
        }
    }
}