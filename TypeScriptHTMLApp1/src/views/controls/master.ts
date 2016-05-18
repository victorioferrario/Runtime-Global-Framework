
namespace Views.Controls {

    export class MasterLayout extends Session.BaseView {

        //ToDo: Remove this from this name space.

        searchTriggers: Views.Controls.Components.SearchButtons;

        //endToDo

        main: Views.Controls.Main;
        aside: Views.Controls.Aside;
        header: Views.Controls.Head;

        userMenuControl: Views.Controls.Components.ProfileMenu;

        constructor() {
            super();
            const self = this;
            self.main = new Views.Controls.Main();
            self.header = new Views.Controls.Head();
        }
        databind(data: any, data2: any) {
            const self = this;
            self.main.databind();
            self.header.databind();
        }

        addProfilePanel() {
            const self = this;
            // ToDo: See Search Top            
            self.userMenuControl
                = new Views.Controls.Components.ProfileMenu();
            self.searchTriggers = new Views.Controls.Components.SearchButtons(self);
        }
        addNotificationPanels() {
            const self = this;
            self.aside = new Views.Controls.Aside();
        }


        toggle() {
            const self = this;
            self.toggleBody();
            self.header.toggle();
            self.main.sideNav.toggle();
        }
        toggleBody() {
            let body = $("body"),
                cssClass = "toggle-icon";
            if (!body.hasClass(cssClass)) {
                body.addClass(cssClass);
            } else {
                body.removeClass(cssClass);
            }

        }
    }

}
