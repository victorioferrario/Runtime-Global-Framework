export class App {
    appContext:Session.AppContext;
    constructor() {
        const self = this;
        self.appContext = Session.AppContext.getInstance();
    }
}

$(document).ready(() => {
    let app = new App();
});
