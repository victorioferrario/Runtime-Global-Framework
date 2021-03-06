/// <reference path="../ref.d.ts" />

namespace Session {

    export class INotificationProps {
        alertCount: number;
        progRCount: number;
    }
    export class DataStorage {
        static setItem(key: string, value: any): boolean {
            localStorage.setItem(key, JSON.stringify(value)); return true;
        }
        static getItem(key: string) {
            return localStorage.getItem(key);
        }
        static getKey(key: string) {
            return localStorage.getItem(key);
        }
        static removeItem(key: string) {
            localStorage.removeItem(key);return true;
        }
        static clear() {
            localStorage.clear();;return true;
        }
    }

    export class DataKeys {
        static menu: string = "data:keys:payload:menu";
        static user: string = "data:keys:payload:user";
        static notifications: string = "data:keys:payload:notifications";
        static search: string = "data:keys:payload:search";
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
        private loadMenu() {
            const self = this;
            let local = JSON.parse(DataStorage.getItem(DataKeys.menu));
            if (local !== undefined && local !== null) {
                self.isLoadedMenu = true;
                self.payloadMenu = local;
                self.dispatchEvent(
                    new Core.Event(
                        AppContext.APP_CONTEXT_MENU_LOADED, self));


            } else {
                Services.Http.loadJson(
                    AppContextSettings.menuUrl).fail(() => {
                        self.dispatchEvent(
                            new Core.Event(AppContext.APP_CONTEXT_ERROR, this));
                    }).done((result: Models.IMenuPayload) => {
                        //
                        self.isLoadedMenu = true;
                        self.payloadMenu = result;
                        console.log(result)
                        //
                        DataStorage.setItem(
                            DataKeys.menu, result);
                        //
                        self.dispatchEvent(
                            new Core.Event(
                                AppContext.APP_CONTEXT_MENU_LOADED, this));
                    });
            }
        }
        /**
        * private Q.Promise to return json.
        * @method loadUser         
        * @return Q.Promise<Models.IUserPayload>
        */
        private loadUser() {
            const self = this;
            let local = JSON.parse(
                DataStorage.getItem(DataKeys.user));
            if (local !== undefined && local !== null) {

                self.isLoadedUser = true;
                self.payloadUser = local;
                self.payloadMenu.entity = local.entity;

                self.dispatchEvent(
                    new Core.Event(
                        AppContext.APP_CONTEXT_USER_LOADED, this));
            } else {

                Services.Http.loadJson(
                    AppContextSettings.userUrl).fail(() => {
                        self.dispatchEvent(
                            new Core.Event(
                                AppContext.APP_CONTEXT_ERROR, this));
                    }).done((result: Models.IUserPayload) => {
                        //
                        self.isLoadedUser = true;
                        self.payloadUser = result;
                        self.payloadMenu.entity = result.entity;
                        //
                        DataStorage.setItem(
                            DataKeys.user, result);
                        //
                        self.dispatchEvent(
                            new Core.Event(
                                AppContext.APP_CONTEXT_USER_LOADED, this));
                    });
            }
        }
        /**
        * private Q.Promise to return json.
        * @method loadNotifications         
        * @return Q.Promise< Models.INotificationsPayload>
        */
        private loadNotifications() {
            const self = this;
            Services.Http.loadJson(AppContextSettings.notificationUrl).fail(() => {
                self.dispatchEvent(
                    new Core.Event(
                        AppContext.APP_CONTEXT_ERROR, self));
            }).done((result: Models.INotificationsPayload) => {

                self.isLoadedNotifications = true;
                self.payloadNotifications = result;

                self.iNotificatonProps = {
                    progRCount: result.notifications.progress_reports !== null && result.notifications.progress_reports !== undefined ? result.notifications.progress_reports.length : 0,
                    alertCount: result.notifications.alerts !== null
                        && result.notifications.alerts !== undefined
                        && result.notifications.alerts.length > 1 ?
                        result.notifications.alerts[0].count + result.notifications.alerts[1].count : 0
                }


                //
                self.dispatchEvent(
                    new Core.Event(
                        AppContext.APP_CONTEXT_NOTIFICATIONS_LOADED, self));
            });

        }
        /**
         * private Q.Promise to return json.
         * @method loadSearhResults         
         * @return Q.Promise< Models.IResults>
         */
        loadSearhResults() {
            const self = this;
            Services.Http.loadJson(AppContextSettings.searchUrl).fail(() => {
                self.dispatchEvent(
                    new Core.Event(
                        AppContext.APP_CONTEXT_ERROR, self));
            }).done((result: Models.ISearchResults) => {
                self.isLoadedSearch = true;
                self.payloadSearch = result;
                self.dispatchEvent(
                    new Core.Event(
                        AppContext.APP_CONTEXT_SEARCH_LOADED, self));
            });
        }
        /**
         * public Q.method to fire all the async calls into a queue.
         * @method initialize         
         * @return null, when each data call is complete, it broadcasts an event.
         */
        handlerMenu() {
            const self = this;
            console.log("menu", self.payloadMenu)
            self.loadUser();
        }
        handlerUser() {
            const self = this;
            console.log("menu", self.payloadMenu);

            self.loadNotifications();
        }
        handlerSearch() {
            const self = this;
            self.removeEventListener(
                AppContext.APP_CONTEXT_MENU_LOADED, self.handlerMenu);

            self.removeEventListener(
                AppContext.APP_CONTEXT_USER_LOADED, self.handlerUser);

            self.removeEventListener(
                AppContext.APP_CONTEXT_NOTIFICATIONS_LOADED, self.handlerNotifications);
            self.dispatchEvent(
                new Core.Event(Models.Events.searchLoaded, self.payloadSearch));
        }
        handlerNotifications() {
            const self = this;
            self.dispatchEvent(
                new Core.Event(Models.Events.dataLoaded,
                    self.payloadMenu));
            self.dispatchEvent(
                new Core.Event(Models.Events.userLoaded,
                    self.payloadUser));
            self.dispatchEvent(
                new Core.Event(Models.Events.notificationsLoaded, self.payloadNotifications));

            self.loadSearhResults();
        }
        
        logout(){
            return DataStorage.clear();
        }
        
        private static APP_CONTEXT_ERROR = "APP_CONTEXT_ERROR";
        private static APP_CONTEXT_MENU_LOADED = "APP_CONTEXT_MENU_LOADED";
        private static APP_CONTEXT_USER_LOADED = "APP_CONTEXT_USER_LOADED";
        private static APP_CONTEXT_SEARCH_LOADED = "APP_CONTEXT_SEARCH_LOADED";
        private static APP_CONTEXT_NOTIFICATIONS_LOADED = "APP_CONTEXT_NOTIFICATIONS_LOADED";

        initialize() {
            const self = this;
            self.addEventListener(
                AppContext.APP_CONTEXT_MENU_LOADED, (arg: any) => {
                    self.handlerMenu();
                });
            self.addEventListener(
                AppContext.APP_CONTEXT_USER_LOADED, (arg: any) => {
                    self.handlerUser();
                });
            self.addEventListener(
                AppContext.APP_CONTEXT_SEARCH_LOADED, (arg: any) => {
                    self.handlerSearch();
                });
            self.addEventListener(
                AppContext.APP_CONTEXT_NOTIFICATIONS_LOADED, (arg: any) => {
                    self.handlerNotifications();
                });
            self.loadMenu();
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
            self.initialize();
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
        appContext: AppContext;
        constructor(id: string) {
            super();
            const self = this;
            self.el = $(`#${id}`);
        }
    }
    export class BaseSelector extends BaseView {
        el: JQuery;
        appContext: AppContext;
        constructor(selector: string) {
            super();
            const self = this;
            self.el = $(`.${selector}`);
        }
    }


}
