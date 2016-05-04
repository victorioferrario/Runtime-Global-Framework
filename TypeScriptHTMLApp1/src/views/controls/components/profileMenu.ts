namespace Views.Controls.Components {
    export class ProfileMenu {
        menu :JQuery;
        menuOpen: JQuery;
        menuClose: JQuery;
        static cssExp = "expanded";
        static cssHide = "m-hide-opacity";
        constructor() {
            const self = this;
            self.menu = $(".user-menu");
            self.menuOpen = $("#user-menu-expand");
            self.menuClose = $("#user-menu-collapse");
            self.init();
        }
        init() {
            const self = this;
            //self.menu
            self.menuOpen.on("click", (evt: any) => {
                ProfileMenu.toggleState(self.menuClose, self.menuOpen, self.menu);
            });
            self.menuClose.on("click", (evt: any) => {
                ProfileMenu.toggleHide(self.menuOpen, self.menuClose, self.menu);
            });
            self.render();
        }
        render() {
           const result = `<a href="javascript:void(0)" id="menu0_link0"
                       class="menu-item waves-effect waves-light"><i class="material-icons menu-icon">account_box</i><span class="menu-text" title="Dashboard">My Profile</span></a>
                    <a href="javascript:void(0)" id="menu0_link1"
                       class="menu-item waves-effect waves-light"><i class="material-icons menu-icon">edit</i><span class="menu-text" title="Dashboard">Edit Profile</span></a>
                    <a href="javascript:void(0)" id="menu0_link2"
                       class="menu-item waves-effect waves-light"><i class="material-icons menu-icon">phone_iphone</i><span class="menu-text" title="Dashboard">Update Phone</span></a>`
            this.menu.append(result);
        }
        static toggleState(linkToShow: JQuery, linkToHide: JQuery, menu: JQuery) {
            if (!menu.hasClass(ProfileMenu.cssExp)) {
                menu.addClass(ProfileMenu.cssExp);
                linkToHide.addClass(ProfileMenu.cssHide);
                linkToShow.removeClass(ProfileMenu.cssHide);
            } else {
                menu.removeClass(ProfileMenu.cssExp);
                linkToHide.removeClass(ProfileMenu.cssHide);
                linkToShow.addClass(ProfileMenu.cssHide);
            }
        }
        static toggleHide(linkToShow:JQuery, linkToHide: JQuery, menu: JQuery) {
                menu.removeClass(ProfileMenu.cssExp);
                linkToShow.removeClass(ProfileMenu.cssHide);
                linkToHide.addClass(ProfileMenu.cssHide);
        }
    }
}
