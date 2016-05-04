/// <reference path="../../../../../typings/tsd.d.ts" />
namespace Views.Controls.Components {
    export class Reports {
        el: JQuery;
        constructor(data: Models.INotificationsPayload) {
            const self = this;
            self.el = $("#progress_reports");
            if (data.notifications.progress_reports !== undefined && data.notifications.progress_reports.length > 0) {
                $("#message_no_progress_reports").hide();
                data.notifications.progress_reports.forEach((item: Models.IProgressReport) => {
                    self.el.append(new ReportItem(item).render());
                });
            }
        }
    }
    export class ReportItem {
        el: JQuery;
        data: Models.IProgressReport;
        constructor(data: Models.IProgressReport) {
            const self = this;
            self.data = data;
            self.el = $("<article>", {
                class: "progress_report__item"
            });
            self.el.append(self.populateControl());
        }
        populateControl() {
            const self = this;
            return `<h5 class="progress_report__date">${self.data.date}</h5>
                <div class="progress_report__message">${self.data.message}</div>
                <div class="progress_report__buttons">
                  <a href="javascript:void(0);" class="btn waves-effect waves-light progress_check"><i class="material-icons">check_circle</i></a>
                  <a href="javascript:void(0);" class="btn waves-effect waves-light progress_x"><i class="material-icons">highlight_off</i></a>
                </div>`;
        }

        render() {
            const self = this;
            return self.el;
        }
        
    }
}
