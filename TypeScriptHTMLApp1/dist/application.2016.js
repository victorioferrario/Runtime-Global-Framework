var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Core;
(function (Core) {
    var Event = (function () {
        function Event(type, targetObj) {
            this.type = type;
            this.target = targetObj;
        }
        Event.prototype.getTarget = function () {
            return this.target;
        };
        Event.prototype.getType = function () {
            return this.type;
        };
        return Event;
    }());
    Core.Event = Event;
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.listeners = [];
        }
        EventDispatcher.prototype.hasEventListener = function (type, listener) {
            var exists = false;
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === type && this.listeners[i].listener === listener) {
                    exists = true;
                }
            }
            return exists;
        };
        EventDispatcher.prototype.addEventListener = function (typeStr, listenerFunc) {
            if (this.hasEventListener(typeStr, listenerFunc)) {
                return;
            }
            this.listeners.push({ type: typeStr, listener: listenerFunc });
        };
        EventDispatcher.prototype.removeEventListener = function (typeStr, listenerFunc) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === typeStr && this.listeners[i].listener === listenerFunc) {
                    this.listeners.splice(i, 1);
                }
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (evt) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === evt.getType()) {
                    this.listeners[i].listener.call(this, evt);
                }
            }
        };
        return EventDispatcher;
    }());
    Core.EventDispatcher = EventDispatcher;
})(Core || (Core = {}));
var Models;
(function (Models) {
    var Events = (function () {
        function Events() {
        }
        Events.dataLoaded = "event:data:loaded";
        Events.userLoaded = "event:user:loaded";
        Events.notificationsLoaded = "event:data:notifications";
        return Events;
    }());
    Models.Events = Events;
})(Models || (Models = {}));
/// <reference path="../../typings/tsd.d.ts" />
var Services;
(function (Services) {
    var Http = (function () {
        function Http() {
        }
        Http.loadJson = function (url) {
            return $.getJSON(url !== "" ? url : "data.json");
        };
        return Http;
    }());
    Services.Http = Http;
})(Services || (Services = {}));
/// <reference path="../../typings/tsd.d.ts" />
var Session;
(function (Session) {
    var DataContext = (function (_super) {
        __extends(DataContext, _super);
        function DataContext() {
            _super.call(this);
            this.isLoadedMenu = false;
            this.isLoadedUser = false;
            this.isLoadedNotifications = false;
            var self = this;
            self.payloadMenu = {
                entity: null,
                list: null
            };
        }
        DataContext.prototype.loadMenu = function () {
            var self = this;
            Services.Http.loadJson(AppContextSettings.menuUrl).fail(function () {
                Q.reject("Error Loading Data");
            }).done(function (result) {
                self.isLoadedMenu = true;
                self.payloadMenu = result;
                Q.resolve(result);
            }).always(function () {
                return Q.resolve(self.payloadMenu);
            });
            return null;
        };
        DataContext.prototype.loadUser = function () {
            var self = this;
            Services.Http.loadJson(AppContextSettings.userUrl).fail(function () {
                Q.reject("Error Loading Data");
            }).done(function (result) {
                self.isLoadedUser = true;
                self.payloadUser = result;
                self.payloadMenu.entity = result.entity;
                Q.resolve(result);
            }).always(function () {
                return Q.resolve(self.payloadUser);
            });
            return null;
        };
        DataContext.prototype.loadNotifications = function () {
            var self = this;
            Services.Http.loadJson(AppContextSettings.notificationUrl).fail(function () {
                Q.reject("Error Loading Notifications");
            }).done(function (result) {
                self.isLoadedNotifications = true;
                self.payloadNotifications = result;
                Q.resolve(result);
            }).always(function () {
                return Q.resolve(self.payloadNotifications);
            });
            return null;
        };
        DataContext.prototype.initialize = function () {
            var self = this;
            Q.all([self.loadMenu(), self.loadUser()]).then(function () {
                if (self.isLoadedMenu) {
                    console.log("isLoadedMenu");
                    self.dispatchEvent(new Core.Event(Models.Events.dataLoaded, self.payloadMenu));
                }
                if (self.isLoadedUser) {
                    self.dispatchEvent(new Core.Event(Models.Events.userLoaded, self.payloadUser));
                }
            });
            Q.all([self.loadNotifications()]).then(function () {
                if (self.isLoadedNotifications) {
                    console.log("this is me");
                    self.dispatchEvent(new Core.Event(Models.Events.notificationsLoaded, self.payloadNotifications));
                }
            });
        };
        return DataContext;
    }(Core.EventDispatcher));
    Session.DataContext = DataContext;
    var Trace = (function () {
        function Trace() {
        }
        Trace.log = function () {
            var value = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                value[_i - 0] = arguments[_i];
            }
            if (AppContextSettings.isDebugConsoleWrite) {
                if (value.length > 0 && value.length < 2) {
                    console.log(value);
                }
                else {
                    console.group("Writter");
                    for (var item in value) {
                    }
                }
            }
        };
        return Trace;
    }());
    Session.Trace = Trace;
    var AppContextSettings = (function () {
        function AppContextSettings() {
        }
        AppContextSettings.isDebug = true;
        AppContextSettings.isDebugConsoleWrite = true;
        AppContextSettings.menuUrl = AppContextSettings.isDebug ? "data.json" : "/navbar_builder";
        AppContextSettings.userUrl = AppContextSettings.isDebug ? "data-user.json" : "/user_profile_information_builder";
        AppContextSettings.notificationUrl = AppContextSettings.isDebug ? "data-notifications.json" : "/dashboard_notification_builder";
        return AppContextSettings;
    }());
    Session.AppContextSettings = AppContextSettings;
    var AppContext = (function (_super) {
        __extends(AppContext, _super);
        function AppContext() {
            _super.call(this);
            this.isLoaded = false;
            var self = this;
            self.initialize();
        }
        AppContext.getInstance = function () {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Session.AppContext();
            }
            return this.instance;
        };
        return AppContext;
    }(DataContext));
    Session.AppContext = AppContext;
})(Session || (Session = {}));
var System;
(function (System) {
    var Singleton = (function () {
        function Singleton() {
        }
        Singleton.getInstance = function () {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Singleton();
            }
            return this.instance;
        };
        return Singleton;
    }());
})(System || (System = {}));
var Views;
(function (Views) {
    var SideNavBase = (function () {
        function SideNavBase() {
            var self = this;
            self.toggleCss = "toggle-icon";
            self.topBar = $(".navbar-brand");
            self.menusWrapper = $(".menus");
            self.contentWrapper = $(".static-content-wrapper");
            self.sideBarWrapper = $(".static-sidebar-wrapper");
        }
        SideNavBase.prototype.toggle = function () {
            var self = this;
            if (!self.sideBarWrapper.hasClass(self.toggleCss)) {
                self.topBar.addClass(self.toggleCss);
                self.menusWrapper.addClass(self.toggleCss);
                self.contentWrapper.addClass(self.toggleCss);
                self.sideBarWrapper.addClass(self.toggleCss);
            }
            else {
                self.topBar.removeClass(self.toggleCss);
                self.menusWrapper.removeClass(self.toggleCss);
                self.contentWrapper.removeClass(self.toggleCss);
                self.sideBarWrapper.removeClass(self.toggleCss);
            }
        };
        return SideNavBase;
    }());
    Views.SideNavBase = SideNavBase;
    var SideNav = (function (_super) {
        __extends(SideNav, _super);
        function SideNav() {
            _super.call(this);
            var self = this;
            self.items = [];
            self.nav = $("#nav-menu");
        }
        SideNav.prototype.init = function (props) {
            var self = this;
            self.props = { data: props };
            var i = 1;
            // self.nav.append(
            //     Views.Controls.Components.Utilities.StringTemplates.profileWidget2(props.entity.user));
            // build menu
            self.props.data.list.forEach(function (segment) {
                self.items.push(new Views.Controls.Navigation.Menu({ index: i++, items: segment }));
            });
            self.items.forEach(function (item) {
                self.nav.append(item.render());
                self.nav.append(Views.Controls.StaticElementBuilder.createMenuSplitter());
            });
        };
        return SideNav;
    }(SideNavBase));
    Views.SideNav = SideNav;
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Base = (function () {
            function Base(id) {
                var self = this;
                self.el = $("#" + id);
                self.appContext = Session.AppContext.getInstance();
            }
            return Base;
        }());
        Controls.Base = Base;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Head = (function (_super) {
            __extends(Head, _super);
            function Head() {
                _super.call(this, "topnav");
            }
            Head.prototype.databind = function (data) {
                var self = this;
                var logoProps = {
                    className: "logo-area",
                    small: {
                        alt: data.payload.entity.logos[0].alt,
                        src: data.payload.entity.logos[0].src,
                        className: data.payload.entity.logos[0].className
                    },
                    large: {
                        alt: data.payload.entity.logos[1].alt,
                        src: data.payload.entity.logos[1].src,
                        className: data.payload.entity.logos[1].className
                    }
                };
                self.rightControl = new Views.Controls.Components.RightMenu();
                self.logoControl = new Views.Controls.Components.LogoControl(logoProps);
                self.render();
            };
            Head.prototype.render = function () {
                var self = this;
                self.el.append(self.logoControl.render());
                self.el.append(self.rightControl.render());
            };
            Head.prototype.toggle = function () {
                var self = this;
                var topBar = $(".navbar-brand"), toggleCss = "toggle-icon";
                if (!topBar.hasClass(toggleCss)) {
                    topBar.addClass(toggleCss);
                }
                else {
                    topBar.removeClass(toggleCss);
                }
            };
            return Head;
        }(Controls.Base));
        Controls.Head = Head;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Base = Views.Controls.Base;
var Head = Views.Controls.Head;
// import Main = Views.Controls.Main;
var SideNav = Views.SideNav;
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                _super.call(this, "wrapper");
            }
            Main.prototype.databind = function (value) {
                var self = this;
                self.sideNav = new Views.SideNav();
                console.log(value);
                self.sideNav.init(value);
            };
            return Main;
        }(Controls.Base));
        Controls.Main = Main;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Main = Views.Controls.Main;
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var MasterLayout = (function () {
            function MasterLayout() {
                var self = this;
                self.main = new Views.Controls.Main();
                self.header = new Views.Controls.Head();
            }
            return MasterLayout;
        }());
        Controls.MasterLayout = MasterLayout;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var AsideButtons = (function () {
        function AsideButtons(ref) {
            var self = this;
            self.parent = ref;
            // Alerts   
            self.buttonCloseAlerts = $("#buttonCloseAlerts");
            self.buttonToggleAlerts = $("#button-toggle-aside_Notifications");
            // Progress Reports
            self.buttonCloseReports = $("#buttonCloseProgressReports");
            self.buttonToggleReports = $("#button-toggle-aside_ProgressReports");
            self.init();
        }
        AsideButtons.prototype.init = function () {
            var self = this;
            self.buttonCloseAlerts.on("click", function (evt) {
                self.parent.hide();
            });
            self.buttonCloseReports.on("click", function (evt) {
                self.parent.hide();
            });
            self.buttonToggleAlerts.on("click", function (evt) {
                self.parent.toggle(false);
            });
            self.buttonToggleReports.on("click", function (evt) {
                self.parent.toggle(true);
            });
        };
        return AsideButtons;
    }());
    Views.AsideButtons = AsideButtons;
    var AsideControl = (function () {
        function AsideControl() {
            var self = this;
            self.aside1 = $(".user-aside-1");
            self.aside2 = $(".user-aside-2");
            self.init();
        }
        AsideControl.prototype.init = function () {
            var self = this;
            self.buttons = new AsideButtons(self);
            self.elUnderlay = $(".extrabar-underlay");
        };
        AsideControl.prototype.hide = function () {
            var self = this;
            self.aside1.removeClass(AsideControl.cssToggle);
            self.aside2.removeClass(AsideControl.cssToggle);
            self.elUnderlay.removeClass(AsideControl.cssToggle);
        };
        AsideControl.prototype.toggle = function (isAlerts) {
            var self = this;
            switch (isAlerts) {
                case true:
                    self.toggleStatic(self.aside2, self.aside1, self.elUnderlay);
                    break;
                case false:
                    self.toggleStatic(self.aside1, self.aside2, self.elUnderlay);
                    break;
            }
        };
        AsideControl.prototype.toggleStatic = function (asideToShow, asideToHide, asideUnderlay) {
            if (!asideToShow.hasClass(AsideControl.cssToggle)) {
                asideToShow.addClass(AsideControl.cssToggle);
                asideUnderlay.addClass(AsideControl.cssToggle);
                asideToHide.removeClass(AsideControl.cssToggle);
            }
            else {
                asideToShow.removeClass(AsideControl.cssToggle);
                asideUnderlay.removeClass(AsideControl.cssToggle);
            }
        };
        AsideControl.cssToggle = "toggle-aside";
        return AsideControl;
    }());
    Views.AsideControl = AsideControl;
    var Page = (function () {
        function Page() {
            var self = this;
            self.layout = new Views.Controls.MasterLayout();
            // AppContext Init
            self.appContext = Session.AppContext.getInstance();
            self.appContext.addEventListener(Models.Events.dataLoaded, function (arg) {
                self.dataLoaded();
            });
            self.appContext.addEventListener(Models.Events.notificationsLoaded, function (arg) {
                self.dataLoaded2();
            });
        }
        Page.prototype.dataLoaded = function () {
            var self = this;
            self.layout.main.databind(self.appContext.payloadMenu);
            self.layout.header.databind({
                payload: self.appContext.payloadUser
            });
            self.init();
        };
        Page.prototype.dataLoaded2 = function () {
            var self = this;
            self.asideControl = new AsideControl();
            self.alerts = new Views.Controls.Components.Alerts(self.appContext.payloadNotifications);
            self.progressReports = new Views.Controls.Components.ProgressReports(self.appContext.payloadNotifications);
        };
        Page.prototype.init = function () {
            var self = this;
            self.pageButtons = new PageButtons(self);
            self.userMenuControl = new Views.Controls.Components.UserMenu();
            setTimeout(function () {
                $('[data-toggle="tooltip"]').tooltip();
                console.log("set bootstrap tooltip");
            }, 2000);
        };
        return Page;
    }());
    Views.Page = Page;
    var PageButtons = (function () {
        function PageButtons(ref) {
            var self = this;
            self.parent = ref;
            self.search = $("#search-box");
            self.searchButton = $("#trigger-search");
            self.buttonToggle = $("#btn-toggle");
            self.init();
        }
        PageButtons.prototype.init = function () {
            var self = this;
            self.buttonToggle.on("click", function (evt) {
                self.parent.layout.header.toggle();
                self.parent.layout.main.sideNav.toggle();
            });
            self.searchButton.on("click", function (evt) {
                self.search.addClass("active");
                self.parent.layout.header.logoControl.searchControl.triggerEvent();
            });
        };
        return PageButtons;
    }());
    Views.PageButtons = PageButtons;
})(Views || (Views = {}));
var toggleFullScreen = function () {
    if (screenfull.enabled) {
        if (!screenfull.isFullscreen) {
            screenfull.request();
        }
        else {
            screenfull.exit();
        }
    }
};
$(document).ready(function () {
    var app = new Views.Page();
    $("#layout-static .static-content-wrapper").append("<div class='extrabar-underlay'></div>");
});
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var Alerts = (function () {
                function Alerts(data) {
                    var _this = this;
                    var self = this;
                    self.el = $("#alerts_wrapper");
                    console.log("is alerts");
                    if (data.notifications.alerts !== undefined && data.notifications.alerts.length > 0) {
                        console.log("bind alerts");
                        $("#message_no_alerts").hide();
                        data.notifications.alerts.forEach(function (item) {
                            _this.el.append(new AlertItem(item).render());
                        });
                    }
                }
                return Alerts;
            }());
            Components.Alerts = Alerts;
            var AlertItem = (function () {
                function AlertItem(data) {
                    var self = this;
                    self.data = data;
                    self.el = $("<article>", {
                        class: "alert-item-wrapper"
                    });
                    self.el.append(self.populateControl());
                }
                AlertItem.prototype.populateControl = function () {
                    var self = this;
                    return "You have " + self.data.count + " " + self.data.type + "s available.";
                };
                AlertItem.prototype.render = function () {
                    var self = this;
                    return self.el;
                };
                return AlertItem;
            }());
            Components.AlertItem = AlertItem;
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var LogoControl = (function () {
                function LogoControl(props) {
                    var self = this;
                    self.el = $("<div/>", {
                        class: props.className
                    });
                    self.lnk = $("<a/>", {
                        href: "javascript:void(0);",
                        class: "navbar-brand navbar-blue"
                    });
                    self.searchControl = new Views.Controls.Components.SearchControl();
                    self.smallLogo = Views.Controls.StaticElementBuilder.createImage(props.small);
                    self.largeLogo = Views.Controls.StaticElementBuilder.createImage(props.large);
                    self.lnk.append(self.smallLogo);
                    self.lnk.append(self.largeLogo);
                }
                LogoControl.prototype.render = function () {
                    var self = this;
                    self.el.append(self.lnk);
                    self.el.append(Components.Utilities.StringTemplates.toggleMenu);
                    self.el.append(self.searchControl.render());
                    self.el.append(Components.Utilities.StringTemplates.toggleSearch);
                    return self.el;
                };
                return LogoControl;
            }());
            Components.LogoControl = LogoControl;
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var ProgressReports = (function () {
                function ProgressReports(data) {
                    var self = this;
                    self.el = $("#progress_reports");
                    if (data.notifications.progress_reports !== undefined && data.notifications.progress_reports.length > 0) {
                        $("#message_no_progress_reports").hide();
                        data.notifications.progress_reports.forEach(function (item) {
                            self.el.append(new ProgressReportItem(item).render());
                        });
                    }
                }
                return ProgressReports;
            }());
            Components.ProgressReports = ProgressReports;
            var ProgressReportItem = (function () {
                function ProgressReportItem(data) {
                    var self = this;
                    self.data = data;
                    self.el = $("<article>", {
                        class: "progress_report__item"
                    });
                    self.el.append(self.populateControl());
                }
                ProgressReportItem.prototype.populateControl = function () {
                    var self = this;
                    return "<h5 class=\"progress_report__date\">" + self.data.date + "</h5>\n                <div class=\"progress_report__message\">" + self.data.message + "</div>\n                <div class=\"progress_report__buttons\">\n                  <a href=\"javascript:void(0);\" class=\"btn waves-effect waves-light progress_check\"><i class=\"material-icons\">check_circle</i></a>\n                  <a href=\"javascript:void(0);\" class=\"btn waves-effect waves-light progress_x\"><i class=\"material-icons\">highlight_off</i></a>\n                </div>";
                };
                ProgressReportItem.prototype.render = function () {
                    var self = this;
                    return self.el;
                };
                return ProgressReportItem;
            }());
            Components.ProgressReportItem = ProgressReportItem;
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var SearchControl = (function () {
                function SearchControl() {
                    var self = this;
                    self.el = $("<div/>", {
                        id: "search-box"
                    });
                    self.elSearchWrapper = $("<div/>", {
                        class: "form-group is-empty"
                    });
                    self.elSearchInput = $("<input/>", {
                        id: "search-input",
                        class: "form-control",
                        placeholder: "Search...",
                        attr: {},
                        blur: function (evt) {
                            console.log(evt);
                        }
                    });
                    self.elSearchWrapper.append(self.elSearchInput);
                    self.el.append(self.elSearchWrapper);
                    $("#button-search-close").click(function (evt) {
                        console.log("test");
                        self.el.removeClass("active");
                        self.elSearchInput.val("");
                        $("body #topnav").toggleClass("search-active");
                    });
                }
                SearchControl.prototype.render = function () {
                    var self = this;
                    return self.el;
                };
                SearchControl.prototype.triggerEvent = function () {
                    var self = this;
                    $("#search-input").focus();
                    $("body #topnav").toggleClass("search-active");
                    $("#button-search-close").click(function (evt) {
                        self.el.removeClass("active");
                        $("body #topnav").removeClass("search-active");
                    });
                };
                SearchControl.prototype.cleanEvent = function () {
                    var self = this;
                    $("#button-search-close").off("click");
                };
                return SearchControl;
            }());
            Components.SearchControl = SearchControl;
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var RightMenu = (function () {
                function RightMenu() {
                    var self = this;
                    self.el = $("<ul/>", { class: "nav navbar-nav toolbar pull-right" });
                    self.el.append('<li class="toolbar-icon-bg appear-on-search ov-h" id="trigger-search-close"><a class="toggle-fullscreen" id="button-search-close"><span class="icon-bg"><i class="material-icons">close</i></span><div class="ripple-container"></div></a> </li>');
                    self.el.append(Components.Utilities.StringTemplates.rightMenuFullScreen);
                    self.appContext = Session.AppContext.getInstance();
                    self.el.append(Components.Utilities.StringTemplates.otherMenuItem(self.appContext.payloadNotifications.notifications.progress_reports.length));
                    self.el.append(Components.Utilities.StringTemplates.notificationMenuItem(self.appContext.payloadNotifications.notifications.alerts.length));
                }
                RightMenu.prototype.render = function () {
                    var self = this;
                    $("#button-toggle-fullscreen").on("click", function (event) {
                        console.log("this");
                    });
                    return self.el;
                };
                RightMenu.prototype.onclickFullScreen = function (event) {
                    if (screenfull.enabled) {
                        if (!screenfull.isFullscreen) {
                            screenfull.request();
                        }
                        else {
                            screenfull.exit();
                        }
                    }
                };
                return RightMenu;
            }());
            Components.RightMenu = RightMenu;
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var UserMenu = (function () {
                function UserMenu() {
                    this.menu = $(".user-menu");
                    var self = this;
                    self.menuOpen = $("#user-menu-expand");
                    self.menuClose = $("#user-menu-collapse");
                    self.init();
                }
                UserMenu.prototype.init = function () {
                    var _this = this;
                    var self = this;
                    self.menuOpen.on("click", function (evt) {
                        console.log(_this);
                        UserMenu.toggleState(self.menuClose, self.menuOpen, self.menu);
                    });
                    self.menuClose.on("click", function (evt) {
                        console.log(_this);
                        UserMenu.toggleState(self.menuOpen, self.menuClose, self.menu);
                    });
                };
                UserMenu.toggleState = function (linkToShow, linkToHide, menu) {
                    if (!menu.hasClass(UserMenu.cssExp)) {
                        menu.addClass(UserMenu.cssExp);
                        linkToHide.addClass(UserMenu.cssHide);
                        linkToShow.removeClass(UserMenu.cssHide);
                    }
                    else {
                        menu.removeClass(UserMenu.cssExp);
                        linkToHide.removeClass(UserMenu.cssHide);
                        linkToShow.addClass(UserMenu.cssHide);
                    }
                };
                UserMenu.cssExp = "expanded";
                UserMenu.cssHide = "m-hide-opacity";
                return UserMenu;
            }());
            Components.UserMenu = UserMenu;
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Navigation;
        (function (Navigation) {
            var Menu = (function () {
                function Menu(props) {
                    var self = this;
                    self.props = props;
                    self.controls = [];
                }
                Menu.prototype.render = function () {
                    var self = this;
                    self.el = $("<div/>", {
                        id: "menu" + self.props.index
                    });
                    var k = 0;
                    self.props.items.data.forEach(function (item) {
                        var prop = item;
                        prop.index = k++;
                        prop.menu = "menu" + self.props.index;
                        self.controls.push(new Controls.MenuItem(prop));
                    });
                    self.controls.forEach(function (lnk) {
                        self.el.append(lnk.render());
                    });
                    return self.el;
                };
                return Menu;
            }());
            Navigation.Menu = Menu;
        })(Navigation = Controls.Navigation || (Controls.Navigation = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var MenuItem = (function () {
            function MenuItem(props) {
                var _this = this;
                this.props = props;
                var self = this;
                self.control = $("<a/>", {
                    href: "javascript:void(0)",
                    id: props.menu + "_link" + props.index,
                    class: "menu-item waves-effect waves-light",
                    title: props.tooltip,
                    click: function (evt) {
                        console.log("this", _this);
                    }
                });
                //self.control.attr("data-toggle", "tooltip");
                //self.control.attr("data-placement", "right");
                self.control
                    .append(Controls.StaticElementBuilder.createIcon(props))
                    .append(Controls.StaticElementBuilder.createText(props));
            }
            MenuItem.prototype.render = function () {
                var self = this;
                return self.control;
            };
            return MenuItem;
        }());
        Controls.MenuItem = MenuItem;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var Utilities;
            (function (Utilities) {
                var StringTemplates = (function () {
                    function StringTemplates() {
                    }
                    StringTemplates.toggleMenu = function () {
                        return '<span id="trigger-sidebar" class="toolbar-trigger toolbar-icon-bg stay-on-search">' +
                            '<a data-toggle="tooltips" data-placement="right" title="Toggle Sidebar" class="waves-effect waves-light" id="btn-toggle">' +
                            '   <span class="icon-bg" style="background: transparent !important;"><i class="material-icons">menu</i></span></a></span>';
                    };
                    StringTemplates.toggleSearch = function () {
                        return '<span id="trigger-search" class="toolbar-trigger toolbar-icon-bg ov-h">' +
                            '<a data-toggle="tooltips" id="toggle-search" data-placement="right" title="Toggle Sidebar" class="waves-effect waves-light">' +
                            '    <span class="icon-bg" style="background: transparent !important;"><i class="material-icons">search</i></span></a></span>';
                    };
                    StringTemplates.searchInput = function () {
                        return '<div id="search-box">' +
                            '<div class="form-group is-empty"><input class="form-control" type="text" placeholder="Search..." id="search-input" style="background: #fff; opacity: .70; border-radius: 2px;color:#000"><span class="material-input"></span></div>' +
                            '</div>';
                    };
                    StringTemplates.rightMenuFullScreen = function () {
                        return '<li class="toolbar-icon-bg hidden-xs" id="trigger-fullscreen">'
                            + '     <a href="#" class="toggle-fullscreen waves-effect waves-light" id="button-toggle-fullscreen" onclick="window.toggleFullScreen();">             '
                            + '         <span class="icon-bg" style="background: transparent !important;">             '
                            + '             <i class="material-icons">fullscreen</i>               '
                            + '         </span><div class="ripple-container"></div>                '
                            + "     </a>               "
                            + " </li>";
                    };
                    StringTemplates.otherMenuItem = function (count) {
                        return "<li class=\"dropdown toolbar-icon-bg\"><a href=\"#\" class=\"hasnotifications dropdown-toggle waves-effect waves-light\" data-toggle=\"dropdown\" id=\"button-toggle-aside_ProgressReports\">\n            <span class=\"badge badge-custom\">" + count + "</span><span class=\"icon-bg\" style=\"background: transparent !important;\"><i class=\"material-icons\">playlist_play</i></span><span class=\"badge badge-info\"></span></a></li>";
                    };
                    StringTemplates.notificationMenuItem = function (count) {
                        return "<li class=\"dropdown toolbar-icon-bg\"><a href=\"#\" class=\"hasnotifications dropdown-toggle waves-effect waves-light\" data-toggle=\"dropdown\" id=\"button-toggle-aside_Notifications\">\n            <span class=\"badge badge-custom\">" + count + "</span><span class=\"icon-bg\" style=\"background: transparent !important;\"><i class=\"material-icons\">notifications</i></span><span class=\"badge badge-info\"></span></a></li>";
                    };
                    StringTemplates.profileWidget2 = function (data) {
                        return "<div class=\"user-widget\">\n                <div class=\"user-avatar\"><img src=\"" + data.avatar + "\" /></div>\n                <div class=\"user-info\">" + data.name + "</div>\n            </div>";
                    };
                    StringTemplates.profileWidget = function () {
                        return '<div class="widget" id="widget-profileinfo" style="height:87px; overflow:hidden; background:#666">'
                            + '    <div class="widget-body">'
                            + '        <div class="userinfo ">'
                            + '            <div class="avatar pull-left">'
                            + '                '
                            + '            </div>'
                            + '            <div class="info">'
                            + '                <span class="username"></span>'
                            + '                <span class="useremail"></span>'
                            + '            </div>'
                            + '            <div class="acct-dropdown clearfix dropdown">'
                            + '                <span class="pull-left"><span class="online-status online"></span></span>'
                            + '                <!-- <span class="pull-right dropdown-toggle" data-toggle="dropdown"><a href="javascript:void(0)" '
                            + '  class="btn btn-fab-caret btn-xs btn-fab"><i class="material-icons">arrow_drop_down</i><div class="ripple-container"></div></a></span>'
                            + '                <ul class="dropdown-menu">'
                            + '                    <li><span class="online-status online"></span> Online</li>'
                            + '                    <li><span class="online-status online"></span> Online</li>'
                            + '                    <li><span class="online-status online"></span> Online</li>'
                            + '                    <li><span class="online-status online"></span> Online</li>'
                            + '                </ul> -->'
                            + '            </div>'
                            + '        </div>'
                            + '    </div>       '
                            + '</div>';
                    };
                    return StringTemplates;
                }());
                Utilities.StringTemplates = StringTemplates;
            })(Utilities = Components.Utilities || (Components.Utilities = {}));
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var StaticElementBuilder = (function () {
            function StaticElementBuilder() {
            }
            StaticElementBuilder.createIcon = function (props) {
                var icon = document.createElement("i");
                icon.setAttribute("class", "material-icons menu-icon");
                icon.innerText = props.icon;
                return icon;
            };
            StaticElementBuilder.createText = function (props) {
                var label = document.createElement("span");
                label.setAttribute("class", "menu-text");
                label.setAttribute("title", props.label);
                label.innerText = props.label;
                return label;
            };
            StaticElementBuilder.createMenuSplitter = function () {
                return $("<div/>", {
                    class: "menu-splitter"
                });
            };
            StaticElementBuilder.createImage = function (props) {
                var image = document.createElement("img");
                image.src = props.src;
                image.setAttribute("title", props.alt);
                image.setAttribute("class", props.className);
                return image;
            };
            return StaticElementBuilder;
        }());
        Controls.StaticElementBuilder = StaticElementBuilder;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
