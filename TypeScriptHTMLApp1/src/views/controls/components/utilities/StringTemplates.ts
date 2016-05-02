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

        static profileWidget2(data:Models.IUser){
            return `<div class="user-widget">
                <div class="user-avatar"><img src="${ data.avatar }" /></div>
                <div class="user-info">${ data.name }</div>
            </div>`;
        }
        static profileWidget(){
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

               + '</div>'
        }
    }

}
