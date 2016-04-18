export class App {
    appContext:Session.AppContext;
    constructor() {
        const self = this;
        self.appContext = Session.AppContext.getInstance();
        // Extrabar
        $("#layout-static .static-content-wrapper").append("<div class='extrabar-underlay'></div>");
    }
    
}
$(document).ready(() => {
    let app = new App();
});
