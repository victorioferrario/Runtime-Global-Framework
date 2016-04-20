namespace Views.Controls {
    export interface IMainProps {
        payload:Models.IMenu;
    }
    export class Main extends Base {
        sideNav:Views.SideNav;
        constructor() {
            super("wrapper");
        }
        databind(value:Models.IPayload) {
            const self = this;
            self.sideNav = new SideNav();
            self.sideNav.init(
                value);
        }
    }
}
