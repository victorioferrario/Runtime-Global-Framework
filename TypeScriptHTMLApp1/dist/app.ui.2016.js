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
var Session;
(function (Session) {
    var AppContext = (function (_super) {
        __extends(AppContext, _super);
        function AppContext() {
            _super.call(this);
            var self = this;
            self.initialize();
        }
        AppContext.getInstance = function () {
            if (this.instance === null || this.instance === undefined) {
                this.instance = new Session.AppContext();
            }
            return this.instance;
        };
        AppContext.prototype.initialize = function () {
            var self = this;
            Services.Http.loadJson("data.json").fail(function () {
                console.warn("Error Loading Data");
            }).done(function (result) {
                self.payload = result;
                self.isLoaded = true;
                self.dispatchEvent(new Core.Event(Models.Events.dataLoaded, self.payload));
            });
        };
        return AppContext;
    }(Core.EventDispatcher));
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
            self.nav.append(Views.Controls.Components.Utilities.StringTemplates.profileWidget());
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
                        alt: data.payload.logos[0].alt,
                        src: data.payload.logos[0].src,
                        className: data.payload.logos[0].className
                    },
                    large: {
                        alt: data.payload.logos[1].alt,
                        src: data.payload.logos[1].src,
                        className: data.payload.logos[1].className
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
    var Page = (function () {
        function Page() {
            var self = this;
            self.layout = new Views.Controls.MasterLayout();
            self.appContext = Session.AppContext.getInstance();
            self.appContext.addEventListener(Models.Events.dataLoaded, function (arg) {
                self.dataLoaded();
            });
        }
        Page.prototype.dataLoaded = function () {
            var self = this;
            self.layout.main.databind(self.appContext.payload);
            self.layout.header.databind({
                payload: self.appContext.payload.entity
            });
            self.init();
        };
        Page.prototype.init = function () {
            var self = this;
            $("#btn-toggle").on("click", function (evt) {
                self.layout.header.toggle();
                self.layout.main.sideNav.toggle();
            });
            //const self = this;
            //self.search = $("#search-box");
            //self.searchButton = $("#trigger-search");
            //self.searchButton.on("click", (evt: any) => {
            //    self.search.addClass("active");
            //    console.log(window.innerWidth);
            //    self.topNav.logoControl.searchControl.triggerEvent();
            //});
            //$("#button-fullscreen").on("click", (evt: any) => {
            //    console.log("hello fullscreen");
            //});
        };
        return Page;
    }());
    Views.Page = Page;
})(Views || (Views = {}));
var toggleFullScreen = function () {
    console.log("toooooooooooooooooo");
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
                    self.el.append(Components.Utilities.StringTemplates.otherMenuItem);
                    self.el.append(Components.Utilities.StringTemplates.notificationMenuItem);
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
                    StringTemplates.otherMenuItem = function () {
                        return '<li class="dropdown toolbar-icon-bg"><a href="#" class="hasnotifications dropdown-toggle waves-effect waves-light" data-toggle="dropdown"><span class="icon-bg" style="background: transparent !important;"><i class="material-icons">playlist_play</i></span><span class="badge badge-info"></span></a></li>';
                    };
                    StringTemplates.notificationMenuItem = function () {
                        return '<li class="dropdown toolbar-icon-bg"><a href="#" class="hasnotifications dropdown-toggle waves-effect waves-light" data-toggle="dropdown"><span class="icon-bg" style="background: transparent !important;"><i class="material-icons">notifications</i></span><span class="badge badge-info"></span></a></li>';
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
