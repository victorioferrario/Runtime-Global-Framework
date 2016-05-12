namespace Views.Controls {

    export class AsideLayout {

        aside1: JQuery;
        aside2: JQuery;

        elUnderlay: JQuery;
        buttons: AsideButtons;

        static cssToggle: string = "toggle-aside";

        constructor() {
            const self = this;
            self.aside1 = $(".user-aside-1");
            self.aside2 = $(".user-aside-2");
            if (self.render()) {
                self.init();
            }
        }

        render() {
            const self = this;
            const result1 = `<header>Alerts</header>
                <a href="javascript:void(0);" class="waves-effect waves-light close" id="buttonCloseAlerts">X</a>
                <section id="alerts_wrapper">
                    <div id="message_no_alerts">No Alerts available.</div>
                </section>`;
            const result2 = ` <header>Progress Reports</header>
                <a href="javascript:void(0);" class="waves-effect waves-light close" id="buttonCloseProgressReports">X</a>
                <section id="progress_reports">
                    <div id="message_no_progress_reports">No Progress Reports available.</div>
                </section>`;

            self.aside1.append(result1);
            self.aside2.append(result2);
            
            return true;
        }
        init() {
            
            const self = this;
            self.buttons = new AsideButtons(self);
            self.elUnderlay = $(".extrabar-underlay");
            
        }
        hide() {
            const self = this;
            self.aside1.removeClass(AsideLayout.cssToggle);
            self.aside2.removeClass(AsideLayout.cssToggle);
            self.elUnderlay.removeClass(AsideLayout.cssToggle);
        }
        toggle(isAlerts: boolean) {
            const self = this;
            switch (isAlerts) {
                case true:
                    self.toggleStatic(
                        self.aside2, 
                        self.aside1, 
                        self.elUnderlay);
                    break;
                case false:
                    self.toggleStatic(
                        self.aside1, 
                        self.aside2, 
                        self.elUnderlay);
                    break;
            }
        }
        
        toggleStatic(asideToShow: JQuery, asideToHide: JQuery, asideUnderlay: JQuery) {
            if (!asideToShow.hasClass(AsideLayout.cssToggle)) {
                asideToShow.addClass(AsideLayout.cssToggle);
                asideUnderlay.addClass(AsideLayout.cssToggle);
                asideToHide.removeClass(AsideLayout.cssToggle);
            } else {
                asideToShow.removeClass(AsideLayout.cssToggle);
                asideUnderlay.removeClass(AsideLayout.cssToggle);
            }
        }
    }

    export class AsideButtons extends Session.BaseView {
        parent: AsideLayout;
        buttonCloseAlerts: JQuery;
        buttonToggleAlerts: JQuery;
        buttonCloseReports: JQuery;
        buttonToggleReports: JQuery;
        constructor(ref: AsideLayout) {
            super();
            //
            const self = this;
            self.parent = ref;
            // Alerts
            self.buttonCloseAlerts = $("#buttonCloseAlerts");
            self.buttonToggleAlerts = $("#button-toggle-aside_Notifications");
            // Progress Reports
            self.buttonCloseReports = $("#buttonCloseProgressReports");
            self.buttonToggleReports = $("#button-toggle-aside_ProgressReports");
            // 
            self.appContext.addEventListener(
                Models.Events.EVENT_UI_TOGGLE_DROPDOWN, ()=>{
                self.parent.hide();
            });
            //
            self.init();
        }
        init() {
            const self = this;
            self.buttonCloseAlerts.on("click", (evt: any) => {
                self.parent.hide();
            });
            self.buttonCloseReports.on("click", (evt: any) => {
                self.parent.hide();
            });
            self.buttonToggleAlerts.on("click", (evt: any) => {                
                self.parent.toggle(false);
                self.appContext.dispatchEvent(
                    new Core.Event(
                        Models.Events.EVENT_UI_TOGGLE_ASIDE, self));
            });
            self.buttonToggleReports.on("click", (evt: any) => {
                self.parent.toggle(true);
                self.appContext.dispatchEvent(
                    new Core.Event(
                        Models.Events.EVENT_UI_TOGGLE_ASIDE, self));
            });
        }
    }

    export class Aside extends Session.BaseView {
        layout: AsideLayout;
        alerts: Controls.Components.Alerts;
        reports: Controls.Components.Reports;
        constructor() {
            super();
            const self = this;
            self.layout = new AsideLayout();
            self.render();
        }
        render() {
            const self = this;
            self.alerts = new Views.Controls.Components.Alerts(
                self.appContext.payloadNotifications);
            self.reports = new Views.Controls.Components.Reports(
                self.appContext.payloadNotifications);
        }
    }
}