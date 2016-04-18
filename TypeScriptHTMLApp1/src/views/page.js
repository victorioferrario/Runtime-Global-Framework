var Views;
(function (Views) {
    var Page = (function () {
        function Page() {
            var self = this;
            self.appContext = Session.AppContext.getInstance();
            self.appContext.addEventListener(Models.Events.dataLoaded, function (arg) {
                self.dataLoaded(arg);
            });
        }
        Page.prototype.dataLoaded = function (arg) {
            var self = this;
            console.log(arg, "dataLoaded", self.appContext.data);
        };
        return Page;
    }());
    Views.Page = Page;
})(Views || (Views = {}));
$(document).ready(function () {
    var app = new Views.Page();
});
//# sourceMappingURL=page.js.map