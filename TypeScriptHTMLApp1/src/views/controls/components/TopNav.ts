/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../../../session/AppContext.ts" />
/// <reference path="utilities/StringTemplates.ts" />
namespace Views.Controls.Components {
    export class RightMenu {
        el: JQuery;
        appContext: Session.AppContext;
        constructor() {
            const self = this;            
            let total = self.appContext.payloadNotifications.notifications.alerts[0].count 
            + self.appContext.payloadNotifications.notifications.alerts[1].count;  
            
            self.appContext = Session.AppContext.getInstance();
            
            self.el = $("<ul/>", { class: "nav navbar-nav toolbar pull-right" });
            self.el.append('<li class="toolbar-icon-bg appear-on-search ov-h" id="trigger-search-close"><a class="toggle-fullscreen" id="button-search-close"><span class="icon-bg"><i class="material-icons">close</i></span><div class="ripple-container"></div></a> </li>');
           
            self.el.append(
                Components.Utilities.StringTemplates.rightMenuFullScreen);       
                    
            self.el.append(
                Components.Utilities.StringTemplates.otherMenuItem(
                     self.appContext.payloadNotifications.notifications.progress_reports.length));           
                     
            self.el.append(
                Components.Utilities.StringTemplates.notificationMenuItem(total));
                        
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
