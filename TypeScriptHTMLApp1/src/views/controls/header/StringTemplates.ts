namespace Views.Controls.Header {
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
    }
}