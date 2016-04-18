var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Session;
(function (Session) {
    var AppContext = (function (_super) {
        __extends(AppContext, _super);
        function AppContext() {
            _super.call(this);
            var self = this;
            self.initialize();
        }
        AppContext.getInstance = function () {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Session.AppContext();
            }
            return this.instance;
        };
        AppContext.prototype.initialize = function () {
            var self = this;
            Services.Http.loadJson("data.json").fail(function () {
                console.warn("Error Loading Data");
            }).progress(function (e) {
                console.log(e);
            }).done(function (result) {
                self.data = result;
                self.isLoaded = true;
                self.dispatchEvent(new Core.Event(Models.Events.dataLoaded, self.data));
            });
        };
        return AppContext;
    }(Core.EventDispatcher));
    Session.AppContext = AppContext;
})(Session || (Session = {}));
//# sourceMappingURL=appContext.js.map