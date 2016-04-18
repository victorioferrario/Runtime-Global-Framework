var System;
(function (System) {
    var Singleton = (function () {
        function Singleton() {
        }
        Singleton.getInstance = function () {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Singleton();
            }
            return this.instance;
        };
        return Singleton;
    }());
})(System || (System = {}));
//# sourceMappingURL=singleton.js.map