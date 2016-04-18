namespace System {
    class Singleton {
        private static instance: Singleton;
        constructor() {
            
        }
        static getInstance() {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Singleton();
            }
            return this.instance;
        }
    }
}