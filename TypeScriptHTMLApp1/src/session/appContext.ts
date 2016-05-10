/// <reference path="../ref.d.ts" />

namespace Session {
    export class INotificationProps {
        alertCount: number;
        progRCount: number;
    }
    export class DataContext extends Core.EventDispatcher {
        target: any;
        isLoadedMenu: boolean = false;
        isLoadedUser: boolean = false;
        isLoadedSearch: boolean = false;
        isLoadedNotifications: boolean = false;

        payload: Models.IMenuPayload;
        payloadMenu: Models.IMenuPayload;
        payloadUser: Models.IUserPayload;
        payloadSearch: Models.ISearchResults;
        payloadNotifications: Models.INotificationsPayload;

        iNotificatonProps: INotificationProps;

        constructor(target?: any) {
            super();
            const self = this;
            self.target = target;
            self.payloadMenu = { entity: null, list: null };
        }
        /**
         * private Q.Promise to return json.
         * @method loadMenu         
         * @return Q.Promise< Models.IMenuPayload>
         */
        private loadMenu(): Q.Promise<any> {
            const self = this;
            Services.Http.loadJson(AppContextSettings.menuUrl).fail(() => {
                Q.reject("Error Loading Data");
            }).done((result: Models.IMenuPayload) => {
                self.isLoadedMenu = true;
                self.payloadMenu = result;
                self.loadUser();
                Q.resolve(result);
            }).always(() => {
                return Q.resolve(self.payloadMenu);
            });
            return null;
        }
        /**
        * private Q.Promise to return json.
        * @method loadUser         
        * @return Q.Promise<Models.IUserPayload>
        */
        private loadUser(): Q.Promise<any> {
            const self = this;
            Services.Http.loadJson(AppContextSettings.userUrl).fail(() => {
                Q.reject("Error Loading Data");
            }).done((result: Models.IUserPayload) => {

                self.isLoadedUser = true;

                self.payloadUser = result;

                self.payloadMenu.entity = result.entity;

                self.dispatchEvent(
                    new Core.Event(Models.Events.dataLoaded, self.payloadMenu));

                // self.dispatchEvent(
                //     new Core.Event(Models.Events.userLoaded, self.payloadUser));

                Q.resolve(result);

            }).always(() => {
                return Q.resolve(self.payloadUser);
            });
            return null;
        }
        /**
        * private Q.Promise to return json.
        * @method loadNotifications         
        * @return Q.Promise< Models.INotificationsPayload>
        */
        private loadNotifications(): Q.Promise<any> {
            const self = this;
            Services.Http.loadJson(AppContextSettings.notificationUrl).fail(() => {
                Q.reject("Error Loading Notifications");
            }).done((result: Models.INotificationsPayload) => {
                self.isLoadedNotifications = true;
                self.payloadNotifications = result;
                self.iNotificatonProps = {
                    progRCount: result.notifications.progress_reports.length,
                    alertCount: result.notifications.alerts[0].count + result.notifications.alerts[1].count
                }
                self.dispatchEvent(
                    new Core.Event(
                        Models.Events.notificationsLoaded,
                        self.payloadNotifications));

                Q.resolve(result);

            }).always(() => {

                return Q.resolve(self.payloadNotifications);
            });
            return null;
        }
        /**
         * private Q.Promise to return json.
         * @method loadSearhResults         
         * @return Q.Promise< Models.IResults>
         */
        private loadSearhResults(): Q.Promise<Models.ISearchResults> {
            const self = this;
            Services.Http.loadJson(AppContextSettings.searchUrl).fail(() => {
                Q.reject("Error Loading Search");
                return null;
            }).done((result: Models.ISearchResults) => {
                self.isLoadedSearch = true;
                self.payloadSearch = result;
                self.dispatchEvent(
                    new Core.Event(
                        Models.Events.searchLoaded,
                        self.payloadSearch));
                Q.resolve(result);
            }).always(() => {
                return Q.resolve(self.payloadSearch);
            });
            return null;
        }
        /**
         * public Q.method to fire all the async calls into a queue.
         * @method initialize         
         * @return null, when each data call is complete, it broadcasts an event.
         */
        initialize() {
            const self = this;
            Q.all([self.loadMenu()]).then(() => {
                if (self.isLoadedMenu) {
                    console.log("isLoadedMenu");
                }
                // if (self.isLoadedUser) {
                //     self.dispatchEvent(
                //         new Core.Event(Models.Events.userLoaded, self.payloadUser));
                // }
            });
            Q.all([self.loadNotifications()]).then(() => {
                // if (self.isLoadedNotifications) {
                //     self.dispatchEvent(
                //         new Core.Event(
                //             Models.Events.notificationsLoaded,
                //             self.payloadNotifications));
                // }
            });
            Q.all([self.loadSearhResults()]).then(() => {
                // if (self.isLoadedSearch) {
                //     self.dispatchEvent(
                //         new Core.Event(
                //             Models.Events.searchLoaded,
                //             self.payloadSearch));
                // }
            });
        }
    }
    export class Trace {
        static log(...value: Array<any>) {
            if (AppContextSettings.isDebugConsoleWrite) {
                if (value.length > 0 && value.length < 2) {
                    console.log(value);
                } else {
                    console.group("Writter")
                    for (var item in value) {
                        console.log(item);
                    }
                }
            }

        }
    }
    export class AppContextSettings {
        static isDebug: boolean = true;
        static isDebugConsoleWrite: boolean = true;
        static menuUrl: string = AppContextSettings.isDebug ? "data.json" : "/navbar_builder";
        static userUrl: string = AppContextSettings.isDebug ? "data-user.json" : "/user_profile_information_builder";
        static searchUrl: string = AppContextSettings.isDebug ? "data-search.json" : "/student_search";
        static notificationUrl: string = AppContextSettings.isDebug ? "data-notifications.json" : "/dashboard_notification_builder";

    }
    export class AppContext extends DataContext {
        private isLoaded: boolean = false;

        private static instance: Session.AppContext;

        constructor(target?: any) {
            super(target);
            const self = this;
        }
        static getInstance(target?: any) {
            if (this.instance === null || this.instance === undefined) {

                this.instance = new Session.AppContext();
                if (target !== null) {
                    this.instance.target = target;
                }
            }
            return this.instance;
        }

    }


    export class BaseView extends Core.EventDispatcher {
        appContext: Session.AppContext;
        constructor() {
            super();
            const self = this;
            self.appContext = Session.AppContext.getInstance();
        }
    }
    export class Base extends BaseView {
        el: JQuery;
        appContext: Session.AppContext;
        constructor(id: string) {
            super();
            const self = this;
            self.el = $(`#${id}`);
        }
    }

}
