import Main = Views.Controls.Main;
namespace Views.Controls {
    export class MasterLayout {
        main: Main;
        header: Views.Controls.Head;
        constructor() {
            const self = this;
            self.main = new Views.Controls.Main();
            self.header = new Views.Controls.Head();
        }
    }
}
