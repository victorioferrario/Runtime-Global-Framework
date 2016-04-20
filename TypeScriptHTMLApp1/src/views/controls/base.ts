namespace Views.Controls {
    export class Base {
        el: JQuery;
        appContext: Session.AppContext;
        constructor(id: string) {
            const self = this;
            self.el = $(`#${id}`);
            self.appContext = Session.AppContext.getInstance();
        }
    }
}