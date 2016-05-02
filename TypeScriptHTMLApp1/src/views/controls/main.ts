namespace Views.Controls {
    export interface IMainProps {
        payload:Models.IMenuPayload;
    }
    export class Main extends Base {
        sideNav:Views.SideNav;
        constructor() {
            super("wrapper");
        }
        databind(value:Models.IMenuPayload) {
            const self = this;
            self.sideNav = new SideNav();
            console.log(value);
            self.sideNav.init(value);
        }
    }
}
