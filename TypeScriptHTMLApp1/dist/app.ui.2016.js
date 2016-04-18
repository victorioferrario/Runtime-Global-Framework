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
                self.data = result;
                self.isLoaded = true;
                self.dispatchEvent(new Core.Event(Models.Events.dataLoaded, self.data));
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
    var Page = (function () {
        function Page() {
            var self = this;
            self.appContext = Session.AppContext.getInstance();
            self.appContext.addEventListener(Models.Events.dataLoaded, function (arg) {
                self.dataLoaded(arg);
            });
        }
        Page.prototype.dataLoaded = function (arg) {
            var self = this;
            self.topNav = new Views.Controls.Header.TopNav();
            self.sideNav = new Views.Controls.SideNav({ data: self.appContext.data });
            self.init();
        };
        Page.prototype.init = function () {
            var self = this;
            self.search = $("#search-box");
            self.searchButton = $("#trigger-search");
            self.searchButton.on("click", function (evt) {
                self.search.addClass("active");
                self.topNav.logoControl.searchControl.triggerEvent();
            });
        };
        return Page;
    }());
    Views.Page = Page;
})(Views || (Views = {}));
$(document).ready(function () {
    var app = new Views.Page();
});
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
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
        Controls.Menu = Menu;
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
                        console.log('this', _this);
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
        var SideNav = (function () {
            function SideNav(props) {
                var self = this;
                self.items = [];
                self.nav = $("#nav-menu");
                self.props = props;
                self.elements = new Controls.SideNavElements();
                self.init();
            }
            SideNav.prototype.init = function () {
                var self = this;
                var i = 1;
                self.props.data.list.forEach(function (segment) {
                    self.items.push(new Controls.Menu({ index: i++, items: segment }));
                });
                self.items.forEach(function (item) {
                    self.nav.append(item.render());
                    self.nav.append(Controls.StaticElementBuilder.createMenuSplitter());
                });
                $("#btn-toggle").on("click", function (evt) {
                    self.elements.toggle();
                });
            };
            return SideNav;
        }());
        Controls.SideNav = SideNav;
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var SideNavElements = (function () {
            function SideNavElements() {
                var self = this;
                self.toggleCss = "toggle-icon";
                self.topBar = $(".navbar-brand");
                self.menusWrapper = $(".menus");
                self.contentWrapper = $(".static-content-wrapper");
                self.sideBarWrapper = $(".static-sidebar-wrapper");
            }
            SideNavElements.prototype.toggle = function () {
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
            return SideNavElements;
        }());
        Controls.SideNavElements = SideNavElements;
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
                return $("<div/>", { class: "menu-splitter" });
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
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Header;
        (function (Header) {
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
                    self.searchControl = new Views.Controls.Header.SearchControl();
                    self.smallLogo = Views.Controls.StaticElementBuilder.createImage(props.small);
                    self.largeLogo = Views.Controls.StaticElementBuilder.createImage(props.large);
                    self.lnk.append(self.smallLogo);
                    self.lnk.append(self.largeLogo);
                }
                LogoControl.prototype.render = function () {
                    var self = this;
                    self.el.append(self.lnk);
                    self.el.append(Views.Controls.Header.StringTemplates.toggleMenu);
                    self.el.append(self.searchControl.render());
                    self.el.append(Views.Controls.Header.StringTemplates.toggleSearch);
                    return self.el;
                };
                return LogoControl;
            }());
            Header.LogoControl = LogoControl;
        })(Header = Controls.Header || (Controls.Header = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Header;
        (function (Header) {
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
                        $('body #topnav').toggleClass('search-active');
                    });
                    console.log($("#button-search-close"));
                }
                SearchControl.prototype.render = function () {
                    var self = this;
                    return self.el;
                };
                SearchControl.prototype.triggerEvent = function () {
                    var self = this;
                    $("#search-input").focus();
                    $('body #topnav').toggleClass('search-active');
                    $("#button-search-close").click(function (evt) {
                        self.el.removeClass("active");
                        $('body #topnav').removeClass('search-active');
                    });
                };
                SearchControl.prototype.cleanEvent = function () {
                    var self = this;
                    $("#button-search-close").off("click");
                };
                return SearchControl;
            }());
            Header.SearchControl = SearchControl;
        })(Header = Controls.Header || (Controls.Header = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Header;
        (function (Header) {
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
                return StringTemplates;
            }());
            Header.StringTemplates = StringTemplates;
        })(Header = Controls.Header || (Controls.Header = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
var Views;
(function (Views) {
    var Controls;
    (function (Controls) {
        var Header;
        (function (Header) {
            var TopNav = (function () {
                function TopNav() {
                    var self = this;
                    self.el = $("#topnav");
                    var logoProps = {
                        className: "logo-area",
                        small: {
                            alt: "Havard",
                            src: "styles/images/h-mini.png",
                            className: "show-on-collapse img-logo-white" },
                        large: {
                            alt: "Havard",
                            src: "styles/images/havard-logo.png",
                            className: "img-white" }
                    };
                    self.logoControl = new Header.LogoControl(logoProps);
                    self.el.append(self.logoControl.render());
                    self.rightControl = new RightMenu();
                    self.el.append(self.rightControl.render());
                }
                return TopNav;
            }());
            Header.TopNav = TopNav;
            var RightMenu = (function () {
                function RightMenu() {
                    var self = this;
                    self.el = $("<ul/>", {
                        class: "nav navbar-nav toolbar pull-right"
                    });
                    self.el.append('<li class="toolbar-icon-bg appear-on-search ov-h" id="trigger-search-close"><a class="toggle-fullscreen" id="button-search-close"><span class="icon-bg"><i class="material-icons">close</i></span><div class="ripple-container"></div></a> </li>');
                }
                RightMenu.prototype.render = function () {
                    var self = this;
                    return self.el;
                };
                return RightMenu;
            }());
            Header.RightMenu = RightMenu;
        })(Header = Controls.Header || (Controls.Header = {}));
    })(Controls = Views.Controls || (Views.Controls = {}));
})(Views || (Views = {}));
