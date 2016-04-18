"use strict";
var App = (function () {
    function App() {
        var self = this;
        self.appContext = Session.AppContext.getInstance();
    }
    return App;
}());
exports.App = App;
$(document).ready(function () {
    var app = new App();
});
//# sourceMappingURL=app.js.map