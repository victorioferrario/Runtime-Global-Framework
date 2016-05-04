/// <reference path="../../../../../typings/tsd.d.ts" />
namespace Views.Controls.Components {
    export class Alerts {
        el: JQuery;
        constructor(data: Models.INotificationsPayload) {
            const self = this;
            self.el = $("#alerts_wrapper");
            console.log("is alerts");
            if (data.notifications.alerts !== undefined 
                && data.notifications.alerts.length > 0) {                
                $("#message_no_alerts").hide();
                data.notifications.alerts.forEach(item => {
                    this.el.append(new AlertItem(item).render());
                });
            }
        }
    }
    export class AlertItem {
        el: JQuery;
        data: Models.IAlert;
        constructor(data: Models.IAlert) {
            const self = this;
            self.data = data;
            self.el = $("<article>", {
                class: "alert-item-wrapper"
            });
            self.el.append(
                self.populateControl());
        }
        populateControl() {
            const self = this;
            return `You have ${self.data.count} ${self.data.type}s available.`;
        }
        render() {
            const self = this;
            return self.el;
        }
    }
}