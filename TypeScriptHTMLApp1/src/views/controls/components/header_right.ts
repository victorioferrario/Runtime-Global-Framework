/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../../../session/AppContext.ts" />
/// <reference path="utilities/StringTemplates.ts" />
namespace Views.Controls.Components {

    import sTemplates = Components.Utilities.StringTemplates;
    import eTemplates = Components.Utilities.ElementTemplates;
    // ------->
    export class RightMenu extends Session.BaseView {

        ulList: JQuery;
        appContext: Session.AppContext;
        controlsList: Array<JQuery | String>;

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

        render() {
            const self = this;
            $("#button-toggle-fullscreen").on("click", (event: any) => {
                console.log("this");
            });
            return self.ulList;
        }

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
