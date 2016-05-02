namespace Views.Controls.Components {
    export class ProgressReports{
        el:JQuery;
        constructor(data:Models.INotificationsPayload){
            const self =this;
            self.el = $("#progress_reports");
            data.notifications.progress_reports.forEach((item:Models.IProgressReport)=>{
                self.el.append(new ProgressReportItem(item).render());
            });
        }
    }
     export class Alerts {
        el:JQuery;
        constructor(data:Models.INotificationsPayload){
            const self =this;
            self.el = $("#notifications_alerts");
            if (data.notifications.alerts !== undefined && data.notifications.alerts.length > 0) {
              $('#message_no_alerts').hide();
                data.notifications.alerts.forEach(function (item) {
                    self.el.append(new AlertItem(item).render());
                });
            }
            // data.notifications.alerts.forEach((item:Models.IAlert)=>{
            //     self.el.append(new AlertItem(item).render());
            // });
        }
    }
    export class AlertItem{
        el:JQuery;
        data:Models.IAlert;
        constructor(data:Models.IAlert){
            const self = this;
            self.data = data;
            self.el = $("<article>", {
                class:"alert-item-wrapper"
            });
            self.el.append(self.populateControl());
        }
        populateControl(){
            const self = this;
            return `You have ${self.data.count} ${self.data.type}.`
        }
        render(){
            const self = this;
            return self.el;
        }
    }
    export class ProgressReportItem{
        el:JQuery;
        data:Models.IProgressReport;
        constructor(data:Models.IProgressReport){
            const self = this;
            self.data = data;
            self.el = $("<article>", {
                class:"progress_report__item"
            });
            self.el.append(self.populateControl());
        }
        populateControl(){
            const self= this;
            return `<h5 class="progress_report__date">${self.data.date}</h5>
                <div class="progress_report__message">${self.data.message}</div>
                <div class="progress_report__buttons">
                  <a href="javascript:void(0);" class="btn waves-effect waves-light progress_check"><i class="material-icons">check_circle</i></a>
                  <a href="javascript:void(0);" class="btn waves-effect waves-light progress_x"><i class="material-icons">highlight_off</i></a>
                </div>`
        }

        render(){
            const self = this;
            return self.el;
        }


    // <article class="progress-report-wrapper">
    //     <h5>Mar 29 at 12:47PM</h5>
    // <div class="progress-report-item">
    //     Did Oral Hettinger complete your deadline to 'Tutoring Meeting Deadline'?
    // </div>
    // <table class="progress-report-item">
    // <tr><td style="width:70px;">&nbsp;</td>
    // <td><a href="javascript:void(0)" class="btn btn-success waves-effect waves-light"><i class="material-icons">check_circle</i></a></td>
    // <td><a href="javascript:void(0)" class="btn btn-danger waves-effect waves-light"><i class="material-icons">highlight_off</i></a></td></tr></table>
    //     </article>
    }
}
