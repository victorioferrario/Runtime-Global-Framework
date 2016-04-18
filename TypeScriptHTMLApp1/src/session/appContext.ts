namespace Session {
    export class AppContext extends Core.EventDispatcher {
        data: Models.IMenu;
        private isLoaded: boolean;
        private static instance: Session.AppContext;
        constructor() {
            super();
            const self = this;
            self.initialize();
        }
        static getInstance() {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Session.AppContext();
            }
            return this.instance;
        }
        initialize() {
            const self = this;
            Services.Http.loadJson("data.json").fail(() => {
                console.warn("Error Loading Data");
            }).done((result: Models.IMenu) => {
                self.data = result;
                self.isLoaded = true;
                self.dispatchEvent(new Core.Event(Models.Events.dataLoaded, self.data));
            });
        }
    }
}