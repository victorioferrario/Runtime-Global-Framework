/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../../../session/AppContext.ts" />
/// <reference path="utilities/StringTemplates.ts" />
namespace Views.Controls.Components {
    export class RightMenu {
        el: JQuery;
        appContext: Session.AppContext;
        constructor() {
            const self = this;  
            self.appContext = Session.AppContext.getInstance();
            self.el = Views.Controls.Components.Utilities.ElementTemplates.ulMenu();
            self.el.append(Components.Utilities.StringTemplates.rightMenuCloseSearch());
            self.el.append(Components.Utilities.StringTemplates.rightMenuFullScreen());      
            self.el.append(Components.Utilities.StringTemplates.otherMenuItem(self.appContext.countProgressReports));          
            self.el.append(Components.Utilities.StringTemplates.notificationMenuItem(self.appContext.countAlerts));
            self.el.append(Components.Utilities.StringTemplates.moreMenuItem());
        }
        render() {
            const self = this;
            $("#button-toggle-fullscreen").on("click", (event: any) => {
                console.log("this");
            });
            return self.el;
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
