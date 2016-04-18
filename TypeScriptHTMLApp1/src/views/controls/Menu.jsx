var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../../typings/uibuilder/uibuilder-1.2.d.ts" />
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Menu = (function (_super) {
            __extends(Menu, _super);
            function Menu(props) {
                _super.call(this, props);
            }
            Menu.prototype.render = function () {
                return <nav></nav>;
            };
            return Menu;
        }(UIBuilder.Component));
        Controls.Menu = Menu;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
//# sourceMappingURL=Menu.jsx.map