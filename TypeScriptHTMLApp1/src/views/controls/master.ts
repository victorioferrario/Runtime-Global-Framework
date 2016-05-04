namespace Views.Controls {
    export class MasterLayout extends Session.BaseView {
        main: Views.Controls.Main;
        aside: Views.Controls.Aside;
        header: Views.Controls.Head;
        searchTemp: PageButtons;
        userMenuControl:Views.Controls.Components.ProfileMenu;
        constructor() {
            super();
            const self = this;
            self.main = new Views.Controls.Main();
            self.header = new Views.Controls.Head();
        }
        addNotificationPanels() {
            const self = this;
            self.aside = new Views.Controls.Aside();
        }
        addOtherElements() {
            const self = this;
             self.searchTemp = new PageButtons(self);
             self.userMenuControl = new Views.Controls.Components.ProfileMenu();
        }
    }
}
