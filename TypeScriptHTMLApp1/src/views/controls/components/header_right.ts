/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../../../session/AppContext.ts" />
/// <reference path="utilities/StringTemplates.ts" />
namespace Views.Controls.Components {

    import sTemplates = Components.Utilities.StringTemplates;
    import eTemplates = Components.Utilities.ElementTemplates;
    // ------->
    /**
     * (description)
     * 
     * @export
     * @class RightMenu
     * @extends {Session.BaseView}
     */
    export class RightMenu extends Session.BaseView {

        /**
         * (description)
         * 
         * @type {JQuery}
         */
        ulList: JQuery;
        /**
         * (description)
         * 
         * @type {Session.AppContext}
         */
        appContext: Session.AppContext;
        /**
         * (description)
         * 
         * @type {(Array<JQuery | String>)}
         */
        controlsList: Array<JQuery | String>;

        /**
         * Creates an instance of RightMenu.
         */
        constructor() {

            super();

            const self = this;
            const iNotify = self.appContext.iNotificatonProps;

            // @create a scratch list of items.
            self.controlsList = [
                sTemplates.rightMenuCloseSearch(),
                sTemplates.headerButtonFullScreen(),
                sTemplates.otherMenuItem(iNotify.progRCount),
                sTemplates.notificationMenuItem(iNotify.alertCount),
                sTemplates.switchDepartmentsMenuItem()
            ];
            // @create ul
            self.ulList = eTemplates.ulMenu();

            // @append li per scratch list.
            self.controlsList.forEach((item: any) => {
                self.ulList.append(item);
            });

        }

        /**
         * (description)
         * 
         * @returns (description)
         */
        render() {
            const self = this;
            $("#button-toggle-fullscreen").on("click", (event: any) => {
                console.log("this");
            });
            return self.ulList;
        }
        
        /**
         * (description)
         * 
         * @param {*} event (description)
         */
        onclickFullScreen(event: any) {
            if (screenfull.enabled) {
                if (!screenfull.isFullscreen) {
                    screenfull.request();
                } else {
                    screenfull.exit();
                }
            }
        }

    }
    declare var screenfull: any;
}
