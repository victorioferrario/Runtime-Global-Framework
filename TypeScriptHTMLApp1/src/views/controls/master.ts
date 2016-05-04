
namespace Views.Controls {

    export class MasterLayout extends Session.BaseView {

        //ToDo: Remove this from this name space.

        searchTemp: PageButtons;

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

        addOtherElements() {
            const self = this;
             // ToDo: See Search Top
             self.searchTemp = new PageButtons(self);
             self.userMenuControl = new Views.Controls.Components.ProfileMenu();
        }
        addNotificationPanels() {
            const self = this;
            self.aside = new Views.Controls.Aside();
        }
        
        databind(data: any, data2: any) {
            const self = this;

            self.main.databind(
                data);

            self.header.databind(
                { payload: data2 }
            );

        }

    }

}
