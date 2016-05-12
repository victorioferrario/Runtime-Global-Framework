namespace Views.Controls {
    export interface IMainProps {
        payload: Models.IMenuPayload;
    }
    export class Main extends Session.Base {
        sideNav: Views.SideNav;
        content: Views.Controls.Content;
        constructor() {
            super("wrapper");
        }
        databind() {
            const self = this;
            self.content = new Content();            
            self.sideNav = new SideNav();          
        }
        
    }
    export class Content extends Session.BaseSelector{
        elContent: JQuery;
        elPageLoader: Views.Controls.Shared.PageLoader;
        constructor() {
            super("static-content-wrapper");
            this.init();
        }
        init() {
            const self = this;
            self.elContent = $(".static-content");
            self.el.append($("<div/>", {
                class: "extrabar-underlay"
            }));
            self.elPageLoader = new Views.Controls.Shared.PageLoader();
            self.elContent.prepend(self.elPageLoader.render());
        }
    }
}
