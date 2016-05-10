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
        Events.searchLoaded = "event:search:loaded";
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
/// <reference path="../ref.d.ts" />
var Session;
(function (Session) {
    var INotificationProps = (function () {
        function INotificationProps() {
        }
        return INotificationProps;
    }());
    Session.INotificationProps = INotificationProps;
    var DataContext = (function (_super) {
        __extends(DataContext, _super);
        function DataContext(target) {
            _super.call(this);
            this.isLoadedMenu = false;
            this.isLoadedUser = false;
            this.isLoadedSearch = false;
            this.isLoadedNotifications = false;
            var self = this;
            self.target = target;
            self.payloadMenu = { entity: null, list: null };
        }
        /**
         * private Q.Promise to return json.
         * @method loadMenu
         * @return Q.Promise< Models.IMenuPayload>
         */
        DataContext.prototype.loadMenu = function () {
            var self = this;
            Services.Http.loadJson(AppContextSettings.menuUrl).fail(function () {
                Q.reject("Error Loading Data");
            }).done(function (result) {
                self.isLoadedMenu = true;
                self.payloadMenu = result;
                self.loadUser();
                Q.resolve(result);
            }).always(function () {
                return Q.resolve(self.payloadMenu);
            });
            return null;
        };
        /**
        * private Q.Promise to return json.
        * @method loadUser
        * @return Q.Promise<Models.IUserPayload>
        */
        DataContext.prototype.loadUser = function () {
            var self = this;
            Services.Http.loadJson(AppContextSettings.userUrl).fail(function () {
                Q.reject("Error Loading Data");
            }).done(function (result) {
                self.isLoadedUser = true;
                self.payloadUser = result;
                self.payloadMenu.entity = result.entity;
                self.dispatchEvent(new Core.Event(Models.Events.dataLoaded, self.payloadMenu));
                // self.dispatchEvent(
                //     new Core.Event(Models.Events.userLoaded, self.payloadUser));
                Q.resolve(result);
            }).always(function () {
                return Q.resolve(self.payloadUser);
            });
            return null;
        };
        /**
        * private Q.Promise to return json.
        * @method loadNotifications
        * @return Q.Promise< Models.INotificationsPayload>
        */
        DataContext.prototype.loadNotifications = function () {
            var self = this;
            Services.Http.loadJson(AppContextSettings.notificationUrl).fail(function () {
                Q.reject("Error Loading Notifications");
            }).done(function (result) {
                self.isLoadedNotifications = true;
                self.payloadNotifications = result;
                self.iNotificatonProps = {
                    progRCount: result.notifications.progress_reports.length,
                    alertCount: result.notifications.alerts[0].count + result.notifications.alerts[1].count
                };
                self.dispatchEvent(new Core.Event(Models.Events.notificationsLoaded, self.payloadNotifications));
                Q.resolve(result);
            }).always(function () {
                return Q.resolve(self.payloadNotifications);
            });
            return null;
        };
        /**
         * private Q.Promise to return json.
         * @method loadSearhResults
         * @return Q.Promise< Models.IResults>
         */
        DataContext.prototype.loadSearhResults = function () {
            var self = this;
            Services.Http.loadJson(AppContextSettings.searchUrl).fail(function () {
                Q.reject("Error Loading Search");
                return null;
            }).done(function (result) {
                self.isLoadedSearch = true;
                self.payloadSearch = result;
                self.dispatchEvent(new Core.Event(Models.Events.searchLoaded, self.payloadSearch));
                Q.resolve(result);
            }).always(function () {
                return Q.resolve(self.payloadSearch);
            });
            return null;
        };
        /**
         * public Q.method to fire all the async calls into a queue.
         * @method initialize
         * @return null, when each data call is complete, it broadcasts an event.
         */
        DataContext.prototype.initialize = function () {
            var self = this;
            Q.all([self.loadMenu()]).then(function () {
                if (self.isLoadedMenu) {
                    console.log("isLoadedMenu");
                }
                // if (self.isLoadedUser) {
                //     self.dispatchEvent(
                //         new Core.Event(Models.Events.userLoaded, self.payloadUser));
                // }
            });
            Q.all([self.loadNotifications()]).then(function () {
                // if (self.isLoadedNotifications) {
                //     self.dispatchEvent(
                //         new Core.Event(
                //             Models.Events.notificationsLoaded,
                //             self.payloadNotifications));
                // }
            });
            // Q.all([]).then(() => {
            //     // if (self.isLoadedSearch) {
            //     //     self.dispatchEvent(
            //     //         new Core.Event(
            //     //             Models.Events.searchLoaded,
            //     //             self.payloadSearch));
            //     // }
            // });
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
                        console.log(item);
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
        AppContextSettings.searchUrl = AppContextSettings.isDebug ? "data-search.json" : "/student_search";
        AppContextSettings.notificationUrl = AppContextSettings.isDebug ? "data-notifications.json" : "/dashboard_notification_builder";
        return AppContextSettings;
    }());
    Session.AppContextSettings = AppContextSettings;
    var AppContext = (function (_super) {
        __extends(AppContext, _super);
        function AppContext(target) {
            _super.call(this, target);
            this.isLoaded = false;
            var self = this;
        }
        AppContext.getInstance = function (target) {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Session.AppContext();
                if (target !== null) {
                    this.instance.target = target;
                }
            }
            return this.instance;
        };
        return AppContext;
    }(DataContext));
    Session.AppContext = AppContext;
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView() {
            _super.call(this);
            var self = this;
            self.appContext = Session.AppContext.getInstance();
        }
        return BaseView;
    }(Core.EventDispatcher));
    Session.BaseView = BaseView;
    var Base = (function (_super) {
        __extends(Base, _super);
        function Base(id) {
            _super.call(this);
            var self = this;
            self.el = $("#" + id);
        }
        return Base;
    }(BaseView));
    Session.Base = Base;
})(Session || (Session = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var Utilities;
            (function (Utilities) {
                var ElementTemplates = (function () {
                    function ElementTemplates() {
                    }
                    ElementTemplates.ulMenu = function () {
                        return $("<ul/>", { class: "nav navbar-nav toolbar pull-right" });
                    };
                    return ElementTemplates;
                }());
                Utilities.ElementTemplates = ElementTemplates;
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
                        return "<div id=\"search-box\">\n                <div class=\"form-group is-empty\">\n                <input class=\"form-control\" type=\"text\" placeholder=\"Search...\" id=\"search-input\" data-bind=\"value: $data.grid.query, valueUpdate: 'keyup'\" style=\"background: #fff; opacity: .70; border-radius: 2px;color:#000\" /><span class=\"material-input\"></span></div>\n                </div>";
                    };
                    StringTemplates.rightMenuCloseSearch = function () {
                        return '<li class="toolbar-icon-bg appear-on-search ov-h" id="trigger-search-close"><a class="toggle-fullscreen" id="button-search-close"><span class="icon-bg"><i class="material-icons">close</i></span><div class="ripple-container"></div></a> </li>';
                    };
                    StringTemplates.headerButtonFullScreen = function () {
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
                    StringTemplates.switchDepartmentsMenuItem = function () {
                        return "<li class=\"dropdown toolbar-icon-bg\" style=\"border-left:solid 1px #ccc\"><a href=\"#\" title=\"Switch Departments\" class=\"hasnotifications dropdown-toggle waves-effect waves-light\" data-toggle=\"dropdown\" id=\"button-Trigger\">\n           <span class=\"icon-bg\" style=\"background: transparent !important;\"><i class=\"material-icons\">layers</i></span></a></li>";
                    };
                    StringTemplates.profileWidget = function (data) {
                        var menu_more = StringTemplates.profileMenuExpandable();
                        return "<div class=\"user-widget\">\n                <div class=\"user-avatar\"><img src=\"" + data.avatar + "\" /></div>\n                <div class=\"user-info\">" + data.name + "</div>\n                " + menu_more + "\n            </div>";
                    };
                    StringTemplates.profileMenuExpandable = function () {
                        return "<div class=\"menu_user__more\">\n              <a href=\"javascript:void(0)\" class=\"more_info_menu__link waves-effect waves-light\" id=\"user-menu-expand\">\n                  <i class=\"material-icons\">keyboard_arrow_down</i>\n              </a>\n              <a href=\"javascript:void(0)\" class=\"more_info_menu__link  m-hide-opacity waves-effect waves-light\" id=\"user-menu-collapse\">\n                  <i class=\"material-icons\">keyboard_arrow_up</i>\n              </a>\n          </div>";
                    };
                    StringTemplates.dropdownMenuComponent = function () {
                        return "<section class=\"dropdown-menu-container\">\n        <div class=\"dropdown-wrapper\">\n            <ul id=\"dropdown\" class=\"material-menu\">\n                <li>\n                    <a href=\"javascript:void(0);\">\n                        <span>History Department</span>\n                    </a>\n                </li>\n                <li>\n                    <a href=\"javascript:void(0);\">\n                        <span>Physics Department</span>\n                    </a>\n                </li>\n                <li>\n                    <a href=\"javascript:void(0);\">\n                        <span>Information Technology</span>\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </section>\n    <section class=\"dropdown-close-background\"></section>\n";
                    };
                    return StringTemplates;
                }());
                Utilities.StringTemplates = StringTemplates;
            })(Utilities = Components.Utilities || (Components.Utilities = {}));
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
/// <reference path="../../../../../typings/tsd.d.ts" />
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
                    if (data.notifications.alerts !== undefined
                        && data.notifications.alerts.length > 0) {
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
/// <reference path="../../../../../typings/tsd.d.ts" />
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var Reports = (function () {
                function Reports(data) {
                    var self = this;
                    self.el = $("#progress_reports");
                    if (data.notifications.progress_reports !== undefined && data.notifications.progress_reports.length > 0) {
                        $("#message_no_progress_reports").hide();
                        data.notifications.progress_reports.forEach(function (item) {
                            self.el.append(new ReportItem(item).render());
                        });
                    }
                }
                return Reports;
            }());
            Components.Reports = Reports;
            var ReportItem = (function () {
                function ReportItem(data) {
                    var self = this;
                    self.data = data;
                    self.el = $("<article>", {
                        class: "progress_report__item"
                    });
                    self.el.append(self.populateControl());
                }
                ReportItem.prototype.populateControl = function () {
                    var self = this;
                    return "<h5 class=\"progress_report__date\">" + self.data.date + "</h5>\n                <div class=\"progress_report__message\">" + self.data.message + "</div>\n                <div class=\"progress_report__buttons\">\n                  <a href=\"javascript:void(0);\" class=\"btn waves-effect waves-light progress_check\"><i class=\"material-icons\">check_circle</i></a>\n                  <a href=\"javascript:void(0);\" class=\"btn waves-effect waves-light progress_x\"><i class=\"material-icons\">highlight_off</i></a>\n                </div>";
                };
                ReportItem.prototype.render = function () {
                    var self = this;
                    return self.el;
                };
                return ReportItem;
            }());
            Components.ReportItem = ReportItem;
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
/// <reference path="../../../../typings/tsd.d.ts" />
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var SearchControl = (function (_super) {
                __extends(SearchControl, _super);
                function SearchControl() {
                    _super.call(this);
                    var self = this;
                    self.grid = new SearchResults();
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
                        attr: {
                            "data-bind": "value: $data.layout.header.leftControl.searchControl.grid.query, valueUpdate: 'keyup'"
                        },
                        blur: function (evt) {
                            console.log(evt);
                        }
                    });
                    self.elSearchWrapper.append(self.elSearchInput);
                    self.el.append(self.elSearchWrapper);
                    $("#button-search-close").click(function (evt) {
                        self.el.removeClass("active");
                        self.elSearchInput.val("");
                        $("body #topnav").toggleClass("search-active");
                    });
                }
                SearchControl.prototype.handlerReady = function () {
                    var self = this;
                    console.log("handlerReady");
                    self.grid.populateControl(self.appContext.payloadSearch);
                };
                SearchControl.prototype.render = function () {
                    var self = this;
                    return self.el;
                };
                SearchControl.prototype.triggerEvent = function () {
                    var self = this;
                    $("#search-input").focus();
                    $("body #topnav").toggleClass("search-active");
                    $(".badge-custom").hide();
                    $(".dropdown-menu-container").hide();
                    $("#button-search-close").click(function (evt) {
                        self.el.removeClass("active");
                        $("body #topnav").removeClass("search-active");
                        $(".badge-custom").show();
                        $(".dropdown-menu-container").show();
                    });
                };
                SearchControl.prototype.cleanEvent = function () {
                    var self = this;
                    $("#button-search-close").off("click");
                };
                return SearchControl;
            }(Session.BaseView));
            Components.SearchControl = SearchControl;
            var SearchResults = (function () {
                //#endregion
                function SearchResults() {
                    var _this = this;
                    var self = this;
                    self.items = ko.observableArray();
                    self.isReady = ko.observable(false);
                    self.query = ko.observable("");
                    self.allCount = ko.observable(0);
                    self.exactMatchCount = ko.observable(0);
                    self.partialMatchCount = ko.observable(0);
                    self.isAllAvailable = ko.observable(false);
                    self.isExactMatchAvailable = ko.observable(false);
                    self.isPartialMatchAvailable = ko.observable(false);
                    self.queryFilter = ko.computed(function () {
                        var temp = self.query();
                        if (self.items().length > 0) {
                            self.items.removeAll();
                        }
                        console.log(temp);
                        console.log(_this);
                        if (self.datasource !== undefined) {
                            console.log(temp, self.datasource);
                            var tempHeadAll = new Models.SearchItemContext(null);
                            tempHeadAll.type = Models.SearchItemContextType.All;
                            self.items.push(tempHeadAll);
                            if (self.query() === "") {
                                //
                                self.isAllAvailable(true);
                                self.isExactMatchAvailable(false);
                                self.allCount(self.datasource.length);
                                //
                                self.datasource.forEach(function (person) {
                                    self.items.push(person);
                                });
                                //
                                self.resetScroll();
                            }
                            else {
                                //
                                self.resetScroll();
                                //
                                var tempHead = new Models.SearchItemContext(null);
                                tempHead.type = Models.SearchItemContextType.Header;
                                self.items.push(tempHead);
                                // sort alphabetically
                                self.datasource.sort(function (left, right) {
                                    return left.f_name == right.f_name ? 0 : (left.f_name < right.f_name ? -1 : 1);
                                });
                                if (isNaN(parseInt(temp))) {
                                    // exact match: f_name
                                    self.datasource.forEach(function (name) {
                                        var f_name = name.f_name.substr(0, self.query().length);
                                        if (f_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                            self.items.push(name);
                                        }
                                    });
                                    // exact match: l_name
                                    self.datasource.forEach(function (name) {
                                        var l_name = name.l_name.substr(0, self.query().length);
                                        if (l_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                            self.items.push(name);
                                        }
                                    });
                                    //
                                    self.isAllAvailable(false);
                                    self.exactMatchCount(self.items().length - 2);
                                    self.isExactMatchAvailable((self.items().length - 2) > 0);
                                    // add splitter
                                    self.items.push(new Models.SearchItemContext(null));
                                    // partial match
                                    var k_1 = 0;
                                    self.datasource.forEach(function (person) {
                                        var f_name = person.f_name.substr(0, self.query().length).toLowerCase();
                                        var l_name = person.l_name.substr(0, self.query().length).toLowerCase();
                                        if (f_name.indexOf(self.query().toLowerCase()) === -1
                                            && l_name.indexOf(self.query().toLowerCase()) === -1
                                            && person.fullname.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                            self.items.push(person);
                                            k_1++;
                                        }
                                    });
                                    console.log(self.items());
                                    self.partialMatchCount(k_1);
                                    self.isPartialMatchAvailable(k_1 > 0);
                                }
                                else {
                                    var id_1 = parseInt(self.query());
                                    self.isExactMatchAvailable(false);
                                    //
                                    var tempHead_1 = new Models.SearchItemContext(null);
                                    tempHead_1.type = Models.SearchItemContextType.SearchById;
                                    self.items.push(tempHead_1);
                                    //
                                    self.datasource.forEach(function (student) {
                                        console.log(id_1, student.id, id_1 + student.id);
                                        if (id_1 === student.id) {
                                            self.items.push(student);
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
                SearchResults.prototype.resetScroll = function () {
                    $(".search-result-popout").scrollTop(0);
                };
                SearchResults.prototype.populateControl = function (data) {
                    var self = this;
                    console.log("populateControl", data);
                    self.datasource = [];
                    data.results.forEach(function (item) {
                        self.datasource.push(new Models.SearchItemContext(item));
                    });
                    self.isReady(true);
                };
                SearchResults.prototype.clear = function (data, event) {
                    var self = this;
                    self.query("");
                    self.resetScroll();
                    event.preventDefault();
                };
                SearchResults.prototype.clickHandler = function (data, event, action, id) {
                    console.log("click", id);
                    switch (action) {
                        case 1:
                            console.log("load profile");
                            break;
                        case 2:
                            console.log("load timeline");
                            break;
                        case 3:
                            console.log("load flags");
                            break;
                        case 4:
                            console.log("load cases");
                            break;
                    }
                };
                SearchResults.prototype.search = function (value) {
                    var self = this;
                };
                return SearchResults;
            }());
            Components.SearchResults = SearchResults;
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
/// <reference path="search.ts" />
/// <reference path="utilities/StringTemplates.ts" />
/// <reference path="../navigation/utilities/StaticElementBuilder.ts" />
/// <reference path="../../../../typings/tsd.d.ts" />
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var elementGenerator = Views.Controls.StaticElementBuilder;
            var BrandControl = (function () {
                function BrandControl(props) {
                    var self = this;
                    self.el = $("<div/>", {
                        "class": props.className
                    });
                    self.lnk = $("<a/>", {
                        href: "javascript:void(0);",
                        "class": "navbar-brand navbar-blue"
                    });
                    self.searchControl = new Views.Controls.Components.SearchControl();
                    self.smallLogo = elementGenerator.createImage(props.small);
                    self.largeLogo = elementGenerator.createImage(props.large);
                    self.lnk.append(self.smallLogo);
                    self.lnk.append(self.largeLogo);
                }
                BrandControl.prototype.render = function () {
                    var self = this;
                    self.el.append(self.lnk);
                    self.el.append(Components.Utilities.StringTemplates.toggleMenu);
                    self.el.append(self.searchControl.render());
                    self.el.append(Components.Utilities.StringTemplates.toggleSearch);
                    return self.el;
                };
                return BrandControl;
            }());
            Components.BrandControl = BrandControl;
        })(Components = Controls.Components || (Controls.Components = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../../../session/AppContext.ts" />
/// <reference path="utilities/StringTemplates.ts" />
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Components;
        (function (Components) {
            var sTemplates = Components.Utilities.StringTemplates;
            var eTemplates = Components.Utilities.ElementTemplates;
            // ------->
            var RightMenu = (function (_super) {
                __extends(RightMenu, _super);
                function RightMenu() {
                    _super.call(this);
                    var self = this;
                    var iNotify = self.appContext.iNotificatonProps;
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
                    self.controlsList.forEach(function (item) {
                        self.ulList.append(item);
                    });
                }
                RightMenu.prototype.render = function () {
                    var self = this;
                    $("#button-toggle-fullscreen").on("click", function (event) {
                        console.log("this");
                    });
                    return self.ulList;
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
            }(Session.BaseView));
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
            var ProfileMenu = (function () {
                function ProfileMenu() {
                    var self = this;
                    self.menu = $(".user-menu");
                    self.menuOpen = $("#user-menu-expand");
                    self.menuClose = $("#user-menu-collapse");
                    self.init();
                }
                ProfileMenu.prototype.init = function () {
                    var self = this;
                    //self.menu
                    self.menuOpen.on("click", function (evt) {
                        ProfileMenu.toggleState(self.menuClose, self.menuOpen, self.menu);
                    });
                    self.menuClose.on("click", function (evt) {
                        ProfileMenu.toggleHide(self.menuOpen, self.menuClose, self.menu);
                    });
                    self.render();
                };
                ProfileMenu.prototype.render = function () {
                    var result = "<a href=\"javascript:void(0)\" id=\"menu0_link0\"\n                       class=\"menu-item waves-effect waves-light\"><i class=\"material-icons menu-icon\">account_box</i><span class=\"menu-text\" title=\"Dashboard\">My Profile</span></a>\n                    <a href=\"javascript:void(0)\" id=\"menu0_link1\"\n                       class=\"menu-item waves-effect waves-light\"><i class=\"material-icons menu-icon\">edit</i><span class=\"menu-text\" title=\"Dashboard\">Edit Profile</span></a>\n                    <a href=\"javascript:void(0)\" id=\"menu0_link2\"\n                       class=\"menu-item waves-effect waves-light\"><i class=\"material-icons menu-icon\">phone_iphone</i><span class=\"menu-text\" title=\"Dashboard\">Update Phone</span></a>";
                    this.menu.append(result);
                };
                ProfileMenu.toggleState = function (linkToShow, linkToHide, menu) {
                    if (!menu.hasClass(ProfileMenu.cssExp)) {
                        menu.addClass(ProfileMenu.cssExp);
                        linkToHide.addClass(ProfileMenu.cssHide);
                        linkToShow.removeClass(ProfileMenu.cssHide);
                    }
                    else {
                        menu.removeClass(ProfileMenu.cssExp);
                        linkToHide.removeClass(ProfileMenu.cssHide);
                        linkToShow.addClass(ProfileMenu.cssHide);
                    }
                };
                ProfileMenu.toggleHide = function (linkToShow, linkToHide, menu) {
                    menu.removeClass(ProfileMenu.cssExp);
                    linkToShow.removeClass(ProfileMenu.cssHide);
                    linkToHide.addClass(ProfileMenu.cssHide);
                };
                ProfileMenu.cssExp = "expanded";
                ProfileMenu.cssHide = "m-hide-opacity";
                return ProfileMenu;
            }());
            Components.ProfileMenu = ProfileMenu;
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
                    title: props.label,
                    rel: "popover",
                    attr: {
                        "data-toggle": "popover",
                        "data-placement": "right",
                        "data-content": "<div style=\"width:250px!important\">" + props.tooltip + "</div>",
                        "data-trigger": "hover"
                    },
                    click: function (evt) {
                        console.log("this", _this);
                    }
                });
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
        var AsideLayout = (function () {
            function AsideLayout() {
                var self = this;
                self.aside1 = $(".user-aside-1");
                self.aside2 = $(".user-aside-2");
                if (self.render()) {
                    self.init();
                }
            }
            AsideLayout.prototype.render = function () {
                var self = this;
                var result1 = "<header>Alerts</header>\n                <a href=\"javascript:void(0);\" class=\"waves-effect waves-light close\" id=\"buttonCloseAlerts\">X</a>\n                <section id=\"alerts_wrapper\">\n                    <div id=\"message_no_alerts\">No Alerts available.</div>\n                </section>";
                var result2 = " <header>Progress Reports</header>\n                <a href=\"javascript:void(0);\" class=\"waves-effect waves-light close\" id=\"buttonCloseProgressReports\">X</a>\n                <section id=\"progress_reports\">\n                    <div id=\"message_no_progress_reports\">No Progress Reports available.</div>\n                </section>";
                self.aside1.append(result1);
                self.aside2.append(result2);
                return true;
            };
            AsideLayout.prototype.init = function () {
                var self = this;
                self.buttons = new AsideButtons(self);
                self.elUnderlay = $(".extrabar-underlay");
            };
            AsideLayout.prototype.hide = function () {
                var self = this;
                self.aside1.removeClass(AsideLayout.cssToggle);
                self.aside2.removeClass(AsideLayout.cssToggle);
                self.elUnderlay.removeClass(AsideLayout.cssToggle);
            };
            AsideLayout.prototype.toggle = function (isAlerts) {
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
            AsideLayout.prototype.toggleStatic = function (asideToShow, asideToHide, asideUnderlay) {
                if (!asideToShow.hasClass(AsideLayout.cssToggle)) {
                    asideToShow.addClass(AsideLayout.cssToggle);
                    asideUnderlay.addClass(AsideLayout.cssToggle);
                    asideToHide.removeClass(AsideLayout.cssToggle);
                }
                else {
                    asideToShow.removeClass(AsideLayout.cssToggle);
                    asideUnderlay.removeClass(AsideLayout.cssToggle);
                }
            };
            AsideLayout.cssToggle = "toggle-aside";
            return AsideLayout;
        }());
        Controls.AsideLayout = AsideLayout;
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
                // 
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
        Controls.AsideButtons = AsideButtons;
        var Aside = (function (_super) {
            __extends(Aside, _super);
            function Aside() {
                _super.call(this);
                var self = this;
                self.layout = new AsideLayout();
                self.render();
            }
            Aside.prototype.render = function () {
                var self = this;
                self.alerts = new Views.Controls.Components.Alerts(self.appContext.payloadNotifications);
                self.reports = new Views.Controls.Components.Reports(self.appContext.payloadNotifications);
            };
            return Aside;
        }(Session.BaseView));
        Controls.Aside = Aside;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
/// <reference path="../../ref.d.ts" />
///** Head                                  **\\\
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var DropdownControl = (function () {
            function DropdownControl(parent) {
                this.parent = parent;
                var self = this;
                parent.append(DropdownControl.htmlPayload);
                //
                self.init();
            }
            DropdownControl.prototype.init = function () {
                var self = this;
                self.ddMenu = $("#dropdown");
                self.ddMenuTrigger = $("#button-Trigger");
                self.ddMenuBackground = $(".dropdown-close-background");
                //
                self.trigger();
            };
            DropdownControl.prototype.trigger = function () {
                var self = this;
                var jqueryArray = [
                    self.ddMenu,
                    self.ddMenuTrigger,
                    self.ddMenuBackground];
                self.ddMenuTrigger.on("click", function (event) {
                    if (!self.ddMenu.hasClass("open")) {
                        self.toggleArrayClass(true, jqueryArray, "open");
                        setTimeout(function () {
                            self.ddMenuBackground.on("mouseenter", function (evt) {
                                self.toggleArrayClass(false, jqueryArray, "open");
                            });
                        }, 1000);
                    }
                    else {
                        self.ddMenuBackground.off("mouseenter", function () {
                        });
                        self.toggleArrayClass(false, jqueryArray, "open");
                    }
                });
            };
            DropdownControl.prototype.toggleArrayClass = function (direction, items, cssClass) {
                items.forEach(function (item) {
                    if (direction) {
                        item.addClass(cssClass);
                    }
                    else {
                        item.removeClass(cssClass);
                    }
                });
            };
            DropdownControl.htmlPayload = Controls.Components.Utilities.StringTemplates.dropdownMenuComponent();
            return DropdownControl;
        }());
        Controls.DropdownControl = DropdownControl;
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
                // RightControl
                self.rightControl
                    = new Views.Controls.Components.RightMenu();
                self.el.append(self.rightControl.render());
                // LeftControl
                self.leftControl
                    = new Views.Controls.Components.BrandControl(logoProps);
                self.el.append(self.leftControl.render());
                // Department switcher menu.
                self.dropControl = new DropdownControl(self.el);
            };
            Head.prototype.render = function () {
                var self = this;
            };
            //ddMenu: JQuery;
            //ddMenuTrigger: JQuery;
            //ddMenuBackground: JQuery;
            //initTrigger() {
            //    const self = this;
            //    const jqueryArray = [
            //        self.ddMenu,
            //        self.ddMenuTrigger,
            //        self.ddMenuBackground];
            //    self.ddMenuTrigger.on("click", (event) => {
            //        if (!self.ddMenu.hasClass("open")) {
            //            self.toggleArrayClass(true, jqueryArray, "open");
            //            setTimeout(() => {
            //                self.ddMenuBackground.on("mouseenter", (evt: any) => {
            //                    self.toggleArrayClass(false, jqueryArray, "open");
            //                });
            //            }, 1000);
            //        } else {
            //            self.ddMenuBackground.off("mouseenter", () => {
            //            });
            //            self.toggleArrayClass(false, jqueryArray, "open");
            //        }
            //    });
            //}
            //toggleArrayClass(direction: boolean, items: Array<JQuery>, cssClass: string) {
            //    items.forEach((item: JQuery) => {
            //        if (direction) {
            //            item.addClass(cssClass);
            //        } else {
            //            item.removeClass(cssClass);
            //        }
            //    });
            //}
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
        }(Session.Base));
        Controls.Head = Head;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
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
                self.content = new Content();
                self.sideNav = new Views.SideNav(value);
            };
            return Main;
        }(Session.Base));
        Controls.Main = Main;
        var Content = (function (_super) {
            __extends(Content, _super);
            function Content() {
                _super.call(this, "static-content-wrapper");
                this.init();
            }
            Content.prototype.init = function () {
                var self = this;
                self.elContent = $(".static-content");
                self.el.append($("<div/>", {
                    class: "extrabar-underlay"
                }));
                self.elPageLoader = new Views.Controls.Shared.PageLoader();
                self.elContent.prepend(self.elPageLoader.render());
            };
            return Content;
        }(Session.Base));
        Controls.Content = Content;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var MasterLayout = (function (_super) {
            __extends(MasterLayout, _super);
            function MasterLayout() {
                _super.call(this);
                var self = this;
                self.main = new Views.Controls.Main();
                self.header = new Views.Controls.Head();
            }
            MasterLayout.prototype.addOtherElements = function () {
                var self = this;
                // ToDo: See Search Top
                self.searchTemp = new Views.PageButtons(self);
                self.userMenuControl = new Views.Controls.Components.ProfileMenu();
            };
            MasterLayout.prototype.addNotificationPanels = function () {
                var self = this;
                self.aside = new Views.Controls.Aside();
            };
            MasterLayout.prototype.databind = function (data, data2) {
                var self = this;
                self.main.databind(data);
                self.header.databind({ payload: data2 });
            };
            return MasterLayout;
        }(Session.BaseView));
        Controls.MasterLayout = MasterLayout;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
/// <reference path="../../../typings/tsd.d.ts" />
var Views;
(function (Views) {
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page() {
            _super.call(this);
            //Responses.
            this.isEventCalled_DataLoaded = false;
            var self = this;
            console.log("MENU");
            self.appContext.target = this;
            self.title = ko.observable("Welcome");
            self.isViewLoaded = ko.observable(false);
            if (self.init()) {
                self.layout
                    = new Views.Controls.MasterLayout();
                self.appContext.initialize();
            }
        }
        Page.prototype.getCount = function (data) {
            if (data.search.isLoaded()) {
                return data.search.pageButtons.length;
            }
            else {
                return 0;
            }
        };
        Page.prototype.init = function () {
            var self = this;
            self.appContext.addEventListener(Models.Events.dataLoaded, function (arg) {
                self.dataLoaded();
            });
            self.appContext.addEventListener(Models.Events.notificationsLoaded, function (arg) {
                self.dataLoaded2();
            });
            self.appContext.addEventListener(Models.Events.searchLoaded, function (arg) {
                self.searchLoaded();
            });
            return true;
        };
        Page.prototype.dataLoaded = function () {
            var self = this;
            console.log("isEventCall_DataLoaded is :", self.isEventCalled_DataLoaded);
            self.layout.databind(self.appContext.payloadMenu, self.appContext.payloadUser);
        };
        Page.prototype.dataLoaded2 = function () {
            var self = this;
            self.layout.addOtherElements();
            self.layout.addNotificationPanels();
        };
        // Search
        Page.prototype.searchLoaded = function () {
            var self = this;
            console.log("methodCalled:searchLoaded");
            self.layout.header.leftControl.searchControl.handlerReady();
            ko.applyBindings(self);
        };
        return Page;
    }(Session.BaseView));
    Views.Page = Page;
    var SearchContext = (function (_super) {
        __extends(SearchContext, _super);
        function SearchContext() {
            _super.call(this);
            this.createChildControls();
        }
        SearchContext.prototype.databind = function () {
            var self = this;
            // self.appContext.payloadSearch.results.filter()
        };
        SearchContext.prototype.createChildControls = function () {
            var self = this;
            $("#q").focus(function () {
                $(".search-result-popout").addClass("active");
                $("body").addClass("search-active");
            });
            $(".search-active-background").click(function () {
                $(".search-result-popout").removeClass("active");
                $("body").removeClass("search-active");
            });
        };
        return SearchContext;
    }(Session.BaseView));
    Views.SearchContext = SearchContext;
    // ToDo: Re-factor this entire object. Most likely go down a namespace. Class name is wrong. The elements seem to be assosicated to search.
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
                self.parent.header.toggle();
                self.parent.main.sideNav.toggle();
            });
            self.searchButton.on("click", function (evt) {
                self.search.addClass("active");
                self.parent.header.leftControl.searchControl.triggerEvent();
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
    console.warn("ready");
    $("#layout-static .static-content-wrapper").append("<div class='extrabar-underlay'></div>");
    var app = new Views.Page();
    $("#q").focus(function () {
        $(".search-result-popout").addClass("active");
        $("body").addClass("search-active");
    });
    $(".search-active-background").click(function () {
        $(".search-result-popout").removeClass("active");
        $("body").removeClass("search-active");
    });
    //ko.applyBindings(app);
});
// // Clean up loader
$(window).load(function () {
    setTimeout(function () {
        $('.page-loader').addClass('fadeOut animated-500').on('webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', function () {
            $(".page-loader").remove();
        });
    }, 1900);
    setTimeout(function () {
        $(".page-content").removeClass("m-hide");
    }, 2000);
    // Pop overs
    var options = {
        html: true
    };
    for (var i = 1; i < 4; i++) {
        switch (i) {
            case 1:
                for (var k = 0; k < 5; k++) {
                    $("#menu" + i + "_link" + k).popover(options);
                }
                break;
            case 2:
                for (var k = 0; k < 4; k++) {
                    $("#menu" + i + "_link" + k).popover(options);
                }
                break;
            case 3:
                for (var k = 0; k < 1; k++) {
                    $("#menu" + i + "_link" + k).popover(options);
                }
                break;
        }
    }
});
var Models;
(function (Models) {
    (function (SearchItemContextType) {
        SearchItemContextType[SearchItemContextType["Normal"] = 0] = "Normal";
        SearchItemContextType[SearchItemContextType["Header"] = 1] = "Header";
        SearchItemContextType[SearchItemContextType["Splitter"] = 2] = "Splitter";
        SearchItemContextType[SearchItemContextType["SearchById"] = 3] = "SearchById";
        SearchItemContextType[SearchItemContextType["All"] = 4] = "All";
    })(Models.SearchItemContextType || (Models.SearchItemContextType = {}));
    var SearchItemContextType = Models.SearchItemContextType;
    var SearchItemContext = (function () {
        function SearchItemContext(data) {
            var self = this;
            if (data !== null) {
                self.id = data.id;
                self.f_name = data.f_name;
                self.l_name = data.l_name;
                self.remote_account = data.remote_account;
                self.fullname = self.f_name + " " + self.l_name;
                self.avatar = data.avatar === null ? "<i class=\"material-icons\">account_circle</i>" : "<img src=\"" + data.avatar + "\" \n                style=\"margin-top:-5px;width: 30px!important;height: 30px!important;margin-left: 10px;\" class=\"thumb img-responsive img-circle\" alt=\"" + self.fullname + "\"/>account_circle</i>";
                self.type = SearchItemContextType.Normal;
            }
            else {
                self.type = SearchItemContextType.Splitter;
            }
        }
        return SearchItemContext;
    }());
    Models.SearchItemContext = SearchItemContext;
})(Models || (Models = {}));
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
/// <reference path="../../typings/tsd.d.ts" />
var Temp;
(function (Temp) {
    var service = (function () {
        function service() {
        }
        service.loadJson = function (url) {
            return $.getJSON(url !== "" ? url : "data.json");
        };
        return service;
    }());
    Temp.service = service;
    var TestContext = (function (_super) {
        __extends(TestContext, _super);
        function TestContext() {
            _super.call(this);
            this.isLoadedSearch = false;
        }
        TestContext.prototype.initialize = function () {
            var self = this;
        };
        TestContext.prototype.loadSearhResults = function () {
            var self = this;
            Services.Http.loadJson("data-search.json").fail(function () {
                Q.reject("Error Loading Search");
                return null;
            }).done(function (result) {
                self.isLoadedSearch = true;
                self.payloadSearch = result;
                Q.resolve(result);
            }).always(function () {
                return Q.resolve(self.payloadSearch);
            });
            return null;
        };
        return TestContext;
    }(Core.EventDispatcher));
    Temp.TestContext = TestContext;
    var SearchContext = (function () {
        //#endregion
        function SearchContext() {
            var self = this;
            self.items = ko.observableArray();
            self.isReady = ko.observable(false);
            self.query = ko.observable("");
            self.allCount = ko.observable(0);
            self.exactMatchCount = ko.observable(0);
            self.partialMatchCount = ko.observable(0);
            self.isAllAvailable = ko.observable(false);
            self.isExactMatchAvailable = ko.observable(false);
            self.isPartialMatchAvailable = ko.observable(false);
            self.queryFilter = ko.computed(function () {
                var temp = self.query();
                if (self.items().length > 0) {
                    self.items.removeAll();
                }
                if (self.datasource !== undefined) {
                    var tempHeadAll = new Models.SearchItemContext(null);
                    tempHeadAll.type = Models.SearchItemContextType.All;
                    self.items.push(tempHeadAll);
                    if (self.query() === "") {
                        //
                        self.isAllAvailable(true);
                        self.isExactMatchAvailable(false);
                        self.allCount(self.datasource.length);
                        //
                        self.datasource.forEach(function (person) {
                            self.items.push(person);
                        });
                        //
                        self.resetScroll();
                    }
                    else {
                        //
                        self.resetScroll();
                        //
                        var tempHead = new Models.SearchItemContext(null);
                        tempHead.type = Models.SearchItemContextType.Header;
                        self.items.push(tempHead);
                        // sort alphabetically
                        self.datasource.sort(function (left, right) {
                            return left.f_name == right.f_name ? 0 : (left.f_name < right.f_name ? -1 : 1);
                        });
                        if (isNaN(parseInt(temp))) {
                            // exact match: f_name
                            self.datasource.forEach(function (name) {
                                var f_name = name.f_name.substr(0, self.query().length);
                                if (f_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                    self.items.push(name);
                                }
                            });
                            // exact match: l_name
                            self.datasource.forEach(function (name) {
                                var l_name = name.l_name.substr(0, self.query().length);
                                if (l_name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                    self.items.push(name);
                                }
                            });
                            //
                            self.isAllAvailable(false);
                            self.exactMatchCount(self.items().length - 2);
                            self.isExactMatchAvailable((self.items().length - 2) > 0);
                            // add splitter
                            self.items.push(new Models.SearchItemContext(null));
                            // partial match
                            var k_2 = 0;
                            self.datasource.forEach(function (person) {
                                var f_name = person.f_name.substr(0, self.query().length).toLowerCase();
                                var l_name = person.l_name.substr(0, self.query().length).toLowerCase();
                                if (f_name.indexOf(self.query().toLowerCase()) === -1
                                    && l_name.indexOf(self.query().toLowerCase()) === -1
                                    && person.fullname.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                                    self.items.push(person);
                                    k_2++;
                                }
                            });
                            self.partialMatchCount(k_2);
                            self.isPartialMatchAvailable(k_2 > 0);
                        }
                        else {
                            var id_2 = parseInt(self.query());
                            self.isExactMatchAvailable(false);
                            //
                            var tempHead_2 = new Models.SearchItemContext(null);
                            tempHead_2.type = Models.SearchItemContextType.SearchById;
                            self.items.push(tempHead_2);
                            //
                            self.datasource.forEach(function (student) {
                                console.log(id_2, student.id, id_2 + student.id);
                                if (id_2 === student.id) {
                                    self.items.push(student);
                                }
                            });
                        }
                    }
                }
            });
        }
        SearchContext.prototype.resetScroll = function () {
            $(".search-result-popout").scrollTop(0);
        };
        SearchContext.prototype.populateControl = function (data) {
            var self = this;
            self.datasource = [];
            data.results.forEach(function (item) {
                self.datasource.push(new Models.SearchItemContext(item));
            });
            self.isReady(true);
        };
        SearchContext.prototype.clear = function (data, event) {
            var self = this;
            self.query("");
            self.resetScroll();
            event.preventDefault();
        };
        SearchContext.prototype.clickHandler = function (data, event, action, id) {
            console.log("click", id);
            switch (action) {
                case 1:
                    console.log("load profile");
                    break;
                case 2:
                    console.log("load timeline");
                    break;
                case 3:
                    console.log("load flags");
                    break;
                case 4:
                    console.log("load cases");
                    break;
            }
        };
        SearchContext.prototype.search = function (value) {
            var self = this;
        };
        return SearchContext;
    }());
    Temp.SearchContext = SearchContext;
    var PageContext = (function () {
        function PageContext() {
            var self = this;
            self.grid = new SearchContext();
            self.testContext = new TestContext();
            self.testContext.addEventListener(Models.Events.searchLoaded, function (arg) {
                self.searchLoaded();
            });
            Q.all([self.testContext.loadSearhResults()]).then(function () {
                if (self.testContext.isLoadedSearch) {
                    self.testContext.dispatchEvent(new Core.Event(Models.Events.searchLoaded, self.testContext.payloadSearch));
                }
            });
            self.testContext.initialize();
        }
        PageContext.prototype.searchLoaded = function () {
            var self = this;
            self.grid.populateControl(self.testContext.payloadSearch);
        };
        return PageContext;
    }());
    Temp.PageContext = PageContext;
})(Temp || (Temp = {}));
var appTest = new Temp.PageContext();
$(document).ready(function () {
    // ko.applyBindings(this.appTest);
});
/// <reference path="../../ref.d.ts" />
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
        function SideNav(props) {
            _super.call(this);
            var self = this;
            self.items = [];
            self.props = { data: props };
            self.nav = $("#nav-menu");
            self.staticColumn = $(".static-sidebar-wrapper");
            self.init();
        }
        SideNav.prototype.init = function () {
            var self = this;
            var i = 1;
            self.staticColumn.prepend(Views.Controls.Components.Utilities.StringTemplates.profileWidget(self.props.data.entity.user));
            self.props.data.list.forEach(function (segment) {
                self.items.push(new Views.Controls.Navigation.Menu({ index: i++, items: segment }));
            });
            self.items.forEach(function (item) {
                self.nav.append(item.render());
                self.nav.append(Views.Controls.StaticElementBuilder.createMenuSplitter());
            });
        };
        SideNav.prototype.render = function () { };
        return SideNav;
    }(SideNavBase));
    Views.SideNav = SideNav;
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Shared;
        (function (Shared) {
            var PageLoader = (function () {
                function PageLoader() {
                }
                PageLoader.prototype.render = function () {
                    return "<div class=\"page-loader\">\n                     <div class=\"cw-loader-control fadeIn animated-300\" id=\"searchLoadIndicatorControl\">\n                       <div class=\"anim\">\n                         <div class=\"colored\"></div></div>\n                     </div>\n                   </div>";
                };
                return PageLoader;
            }());
            Shared.PageLoader = PageLoader;
        })(Shared = Controls.Shared || (Controls.Shared = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Components;
    (function (Components) {
        var Grid;
        (function (Grid) {
            var GridMetrics = (function () {
                function GridMetrics(dsLength) {
                    var self = this;
                    self.limit = 10;
                    self.totalCount = dsLength;
                    self.totalPages = Math.ceil(self.totalCount / self.limit);
                    console.log(self.totalCount / self.limit, self.totalPages);
                }
                GridMetrics.prototype.update = function (pageCount) {
                    var self = this;
                    self.limit = pageCount;
                    self.totalPages = Math.ceil(self.totalCount / self.limit);
                };
                return GridMetrics;
            }());
            Grid.GridMetrics = GridMetrics;
            var GridPagerButton = (function () {
                function GridPagerButton(ref, arg) {
                    var self = this;
                    self.label = ko.observable(arg);
                    self.value = ko.observable(arg);
                    self.pageIndex = ko.observable(ref);
                    self.isActive = ko.pureComputed(function () { return self.pageIndex() === self.value() ? "active" : "no"; }, self);
                }
                return GridPagerButton;
            }());
            Grid.GridPagerButton = GridPagerButton;
        })(Grid = Components.Grid || (Components.Grid = {}));
    })(Components = Views.Components || (Views.Components = {}));
})(Views || (Views = {}));
/// <reference path="../../../../../typings/tsd.d.ts" />
var Views;
(function (Views) {
    var Components;
    (function (Components) {
        var Grid;
        (function (Grid) {
            var StaticGridEvents = (function () {
                function StaticGridEvents() {
                }
                StaticGridEvents.ready = "event:grid:ready";
                return StaticGridEvents;
            }());
            Grid.StaticGridEvents = StaticGridEvents;
            var GridViewModel = (function (_super) {
                __extends(GridViewModel, _super);
                function GridViewModel() {
                    _super.call(this, "gridView");
                    var self = this;
                    self.isLoaded = ko.observable(false);
                }
                GridViewModel.prototype.databind = function () {
                    console.log("search:databind");
                    var self = this;
                    self.datasource = self.appContext.payloadSearch;
                    if (self.createChildControls()) {
                        console.log("databind:before:dispatchEvent");
                        self.dispatchEvent(new Core.Event(StaticGridEvents.ready, self.appContext.payloadSearch));
                    }
                };
                GridViewModel.prototype.createChildControls = function () {
                    var _this = this;
                    var self = this;
                    self.metrics = new Grid.GridMetrics(self.datasource.results.length);
                    self.contextSearch = ko.observable("");
                    self.items = ko.observableArray([]);
                    self.isSorting
                        = ko.observable(false);
                    self.sortColumn
                        = ko.observable("Name");
                    self.pageSize = ko.observable(self.metrics.limit);
                    self.totalCount = ko.observable(self.metrics.totalCount);
                    self.totalPages = ko.observable(self.metrics.totalPages);
                    self.currentPage = ko.observable(0);
                    self.itemsPerPageCount = ko.observable(10);
                    self.pageButtons = ko.observableArray([]);
                    for (var i = 0; i < self.totalPages(); i++) {
                        self.pageButtons.push(new Grid.GridPagerButton(self.currentPage(), i + 1));
                    }
                    self.pageButtons().forEach(function (item) {
                        console.log(item);
                    });
                    self.isLoaded(true);
                    console.log("set is loaded", self.isLoaded());
                    self.watchItemsPerPageCount = ko.pureComputed(function () {
                        self.metrics.update(self.itemsPerPageCount());
                        return " " + self.itemsPerPageCount().toString();
                    }).extend({
                        notify: 'always'
                    });
                    self.isBack = ko.pureComputed(function () {
                        return self.currentPage() > 1 ? "" : "disabled";
                    }, self);
                    self.isNext = ko.computed(function () {
                        return self.currentPage() === self.totalPages() ? "disabled" : "en";
                    }, self);
                    self.firstItemOnPage = ko.computed(function () {
                        return (self.currentPage() - 1) * self.pageSize() + 1;
                    });
                    self.lastItemOnPage = ko.computed(function () {
                        var num = self.firstItemOnPage() + self.pageSize() - 1;
                        return num > self.totalCount() ? self.totalCount() : num;
                    });
                    self.pagedItems = ko.computed(function () {
                        if (!self.isSorting()) {
                            return self.datasource.results.slice(self.firstItemOnPage() - 1, self.lastItemOnPage());
                        }
                        else {
                            return self.filteredRows().slice(self.firstItemOnPage() - 1, self.lastItemOnPage());
                        }
                    });
                    console.log("self.datasource.results", self.datasource.results);
                    self.filteredRows = ko.computed(function () {
                        var tttt = typeof self.datasource.results !== "function" ? self.datasource.results : _this.datasource.results;
                        var rows = tttt, search = self.contextSearch().toLowerCase();
                        if (search === '') {
                            $("#pagerButton-Container").show();
                            return rows.slice();
                        }
                        if (search !== '') {
                            self.currentPage(1);
                            $("#pagerButton-Container").hide();
                        }
                        return ko.utils.arrayFilter(rows, function (row) {
                            var v = row["f_name"];
                            v = ko.unwrap(v);
                            if (v) {
                                if ($.isNumeric(v)) {
                                    if (v === search)
                                        return true;
                                }
                                else if (Date.parse(v)) {
                                    if (Date.parse(v) === Date.parse(search))
                                        return true;
                                }
                                else if (v.toString().toLowerCase().indexOf(search) >= 0) {
                                    this.currentPage();
                                    return true;
                                }
                            }
                            return false;
                        });
                    }).extend({ throttle: 1 });
                    console.log("self.filteredRows ", self.filteredRows());
                    self.isFirstSort = ko.observable(0);
                    self.sortedRows = ko.computed(function () {
                        self.pageSize(self.metrics.limit);
                        self.totalCount(self.metrics.totalCount);
                        self.totalPages(self.metrics.totalPages);
                        var sorted = self.filteredRows().slice(), //We don't want to be sorting the original list
                        sortDirection = self.sortDesc() ? 1 : -1, sortProperty = self.sortColumn() || "";
                        if (sortProperty === "") {
                            return sorted;
                        }
                        var sort = function (a, b) { return self.standardSort(a, b, sortProperty) * sortDirection; };
                        return sorted.sort(sort);
                    }).extend({ throttle: 10 });
                    console.log("self.filteredRows ", self.sortedRows());
                    self.rows = ko.computed({
                        read: function () {
                            var sortedRows = self.sortedRows();
                            return sortedRows.slice(self.firstItemOnPage() - 1, self.lastItemOnPage());
                        },
                        deferEvaluation: true
                    });
                    console.log("self.sortedRows", self.sortedRows());
                    console.log("self.datasource.results", self.rows());
                    self.sortColumn("f_name");
                    return true;
                };
                GridViewModel.prototype.standardSort = function (a, b, sortProperty) {
                    var propA = ko.unwrap(a[sortProperty]), propB = ko.unwrap(b[sortProperty]);
                    if (propA === propB)
                        return 0;
                    return propA < propB ? 1 : -1;
                };
                ;
                return GridViewModel;
            }(Session.Base));
            Grid.GridViewModel = GridViewModel;
            var GridView = (function (_super) {
                __extends(GridView, _super);
                function GridView() {
                    _super.call(this);
                    var self = this;
                    self.searchTitle = ko.observable("Search Title");
                }
                GridView.prototype.handlerReady = function () {
                    console.log("ready");
                    var self = this;
                };
                GridView.prototype.onSortCommand = function (column) {
                    var self = this;
                    self.currentPage(1);
                    self.isSorting(true);
                    if (self.sortDesc()) {
                        self.sortColumn(column);
                        self.sortDesc(false);
                    }
                    else {
                        self.sortDesc(true);
                        self.sortColumn(column);
                    }
                    self.updateView(self.currentPage());
                };
                GridView.prototype.getSortColumn = function (instance) {
                    var self = this;
                    return self.sortColumn() === instance;
                };
                GridView.prototype.updateView = function (index) {
                    var self = this;
                    self.currentPage(index);
                    ko.utils.arrayForEach(self.pageButtons(), function (item) {
                        item.pageIndex(index);
                    });
                };
                return GridView;
            }(GridViewModel));
            Grid.GridView = GridView;
        })(Grid = Components.Grid || (Components.Grid = {}));
    })(Components = Views.Components || (Views.Components = {}));
})(Views || (Views = {}));
// namespace Views.Controls.Components.Forms {
//     export class AutoCompleteControl {
//         isInputFocused: KnockoutObservable<boolean>;
//         isInputFocusedComputed: KnockoutComputed<boolean>;
//         selectedItemList: KnockoutObservableArray<any>;
//         selectedItem: KnockoutObservable<any>;
//         selectedItemValue: KnockoutObservable<any>;
//         constructor() {
//             const self = this;
//             self.initBindHandler();
//             self.selectedItem = ko.observable("");
//             self.selectedItemValue = ko.observable("");
//             self.selectedItemList = ko.observableArray();
//             self.isInputFocused = ko.observable(false);
//             self.isInputFocusedComputed = ko.computed(() => {
//                 if (self.selectedItemList().length > 0) {
//                 } else if (self.selectedItemList().length === 0) {
//                 }
//                 if (this.isInputFocused()) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             });
//         }
//         searchOnFocus(data: any, event: any) {
//             console.log(data);
//         }
//         searchOnBlur(data: any, event: any) {
//             console.log(data);
//         }
//         initBindHandler() {
//             var self = this;
//             ko.bindingHandlers.autoComplete = {
//                 init(element, valueAccessor, allBiindings, viewModel, bindingContext) {
//                     var settings = valueAccessor();
//                     var selectedItem = settings.selected;
//                     var updateElementValueWithLabel = (event:any, ui:any) => {
//                         event.preventDefault();
//                         $(element).val(ui.item.label);
//                         if (typeof ui.item !== "undefined") { selectedItem(ui.item); }
//                     };
//                     $(element).autocomplete({
//                         minLength: 3,
//                         source(request:any, response:any) {
//                             let arrayResult = [
//                                 {
//                                     label: "Hello",
//                                     value: 1
//                                 },
//                                 {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }, {
//                                     label: "Hello",
//                                     value: 1
//                                 }
//                             ];
//                             response(arrayResult);
//                         },
//                         select(event:any, ui:any) {
//                             if (ui.item) {
//                                 updateElementValueWithLabel(event, ui);
//                             }
//                         },
//                         focus(event:any, ui:any) {
//                             console.log("focus");
//                             if (ui.item) {
//                                 updateElementValueWithLabel(event, ui);
//                             }
//                         },
//                         change(event:any, ui:any) {
//                             if (ui.item) {
//                                 updateElementValueWithLabel(event, ui);
//                             }
//                         }
//                     });
//                 }
//             };
//         }
//     }
// }
// // let searchApp = window["searchApp"] || {};
// // window["searchApp"].autoCompleteControl = new Views.Controls.Components.Forms.AutoCompleteControl();
// // $(document).ready(() => {    
// //     console.log(window["searchApp"].autoCompleteControl)
// //     ko.applyBindings(window["searchApp"]);
// // }); 
