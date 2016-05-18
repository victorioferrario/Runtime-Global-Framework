namespace Core {    
    export class Event {
        private type: string;
        private target: any;
        constructor(type: string, targetObj: any) {
            this.type = type;
            this.target = targetObj;
        }
        getTarget(): any {
            return this.target;
        }
        getType(): string {
            return this.type;
        }
    }
    export class EventDispatcher {
        private listeners: any[];
        constructor() {
            this.listeners = [];
        }
        hasEventListener(type: string, listener: Function): Boolean {
             let exists: Boolean = false;
             for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === type && this.listeners[i].listener === listener) {
                    exists = true;
                }
            }
            return exists;
        }
        addEventListener(typeStr: string, listenerFunc: Function): void {
            if (this.hasEventListener(typeStr, listenerFunc)) {
                return;
            }

            this.listeners.push({ type: typeStr, listener: listenerFunc });
        }
        removeEventListener(typeStr: string, listenerFunc: Function): void {
            for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === typeStr && this.listeners[i].listener === listenerFunc) {
                    this.listeners.splice(i, 1);
                }
            }
        }
        dispatchEvent(evt: Event) {
            for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === evt.getType()) {
                    this.listeners[i].listener.call(this, evt);
                }
            }
        }
    }
}
