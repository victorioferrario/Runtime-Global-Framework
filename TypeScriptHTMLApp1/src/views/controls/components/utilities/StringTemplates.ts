namespace Views.Controls.Components.Utilities {
    export class StringTemplates{
        static toggleMenu(){
             return '<span id="trigger-sidebar" class="toolbar-trigger toolbar-icon-bg stay-on-search">' +
                '<a data-toggle="tooltips" data-placement="right" title="Toggle Sidebar" class="waves-effect waves-light" id="btn-toggle">' +
                '   <span class="icon-bg" style="background: transparent !important;"><i class="material-icons">menu</i></span></a></span>';
        }
        static toggleSearch(){
             return '<span id="trigger-search" class="toolbar-trigger toolbar-icon-bg ov-h">' +
                '<a data-toggle="tooltips" id="toggle-search" data-placement="right" title="Toggle Sidebar" class="waves-effect waves-light">'  +
                '    <span class="icon-bg" style="background: transparent !important;"><i class="material-icons">search</i></span></a></span>';
        }
        static searchInput(){
            return '<div id="search-box">'+
                '<div class="form-group is-empty"><input class="form-control" type="text" placeholder="Search..." id="search-input" style="background: #fff; opacity: .70; border-radius: 2px;color:#000"><span class="material-input"></span></div>' +
                '</div>';
        }

        static rightMenuFullScreen(){
           return '<li class="toolbar-icon-bg hidden-xs" id="trigger-fullscreen">'
          + '     <a href="#" class="toggle-fullscreen waves-effect waves-light" id="button-toggle-fullscreen" onclick="window.toggleFullScreen();">             '
          + '         <span class="icon-bg" style="background: transparent !important;">             '
          + '             <i class="material-icons">fullscreen</i>               '
          + '         </span><div class="ripple-container"></div>                '
          + "     </a>               "
          + " </li>";
        }
        static otherMenuItem(count:number){
            return `<li class="dropdown toolbar-icon-bg"><a href="#" class="hasnotifications dropdown-toggle waves-effect waves-light" data-toggle="dropdown" id="button-toggle-aside_ProgressReports">
            <span class="badge badge-custom">${ count }</span><span class="icon-bg" style="background: transparent !important;"><i class="material-icons">playlist_play</i></span><span class="badge badge-info"></span></a></li>`;
        }
        static notificationMenuItem(count:number){
            return `<li class="dropdown toolbar-icon-bg"><a href="#" class="hasnotifications dropdown-toggle waves-effect waves-light" data-toggle="dropdown" id="button-toggle-aside_Notifications">
            <span class="badge badge-custom">${ count }</span><span class="icon-bg" style="background: transparent !important;"><i class="material-icons">notifications</i></span><span class="badge badge-info"></span></a></li>`;
        }
        static moreMenuItem(){
            return `<li class="dropdown toolbar-icon-bg"><a href="#" class="hasnotifications dropdown-toggle waves-effect waves-light" data-toggle="dropdown" id="button-Trigger">
           <span class="icon-bg" style="background: transparent !important;"><i class="material-icons">layers</i></span></a></li>`;
        }

        static profileWidget(data:Models.IUser){
            let menu_more = StringTemplates.profileMenuExpandable();
            return `<div class="user-widget">
                <div class="user-avatar"><img src="${ data.avatar }" /></div>
                <div class="user-info">${ data.name }</div>
                ${ menu_more }
            </div>`;
        }
        static profileMenuExpandable(){
          return `<div class="menu_user__more">
              <a href="javascript:void(0)" class="more_info_menu__link waves-effect waves-light" id="user-menu-expand">
                  <i class="material-icons">keyboard_arrow_down</i>
              </a>
              <a href="javascript:void(0)" class="more_info_menu__link  m-hide-opacity waves-effect waves-light" id="user-menu-collapse">
                  <i class="material-icons">keyboard_arrow_up</i>
              </a>
          </div>`;
        }
        static dropdownMenuComponent(){
           return `<section class="dropdown-menu-container">
        <div class="dropdown-wrapper">
            <ul id="dropdown" class="material-menu">
                <li>
                    <a href="javascript:void(0);">
                        <span>History Department</span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
                        <span>Physics Department</span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);">
                        <span>Information Technology</span>
                    </a>
                </li>
            </ul>
        </div>
    </section>`;
        }
    }

}
