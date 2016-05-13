module.exports = {
    bundle: {
        vendor: {
            styles: [
                "libs/css/google.material.css",
                "libs/css/google.roboto.css",
                "libs/css/animate.css",                
                "libs/vendor/waves.css"                
                ],
            scripts: [               
                "libs/vendors/jquery/jquery-plugins/jquery-ui-slider-pips.js",
                "libs/vendors/jquery/jquery-plugins/jquery-select.js",
                "libs/vendors/jquery/jquery-plugins/jquery-slider.js",
                "libs/vendors/jquery/jquery-plugins/jquery-switch.js",                
                "libs/vendors/knockout/knockout-3.4.0.js",
                "libs/vendors/knockout/knockout-postbox.js",
                "libs/vendors/knockout/knockout.mapping.js",
                "libs/vendors/plugins/moment.min.js",
                "libs/vendors/bootstrap/js/bootstrap.js",                    
                "libs/vendors/bootstrap-plugins/bootstrap-datetime-picker.js", 
                "libs/vendors/bootstrap-plugins/bootstrap-select.js",
                "libs/vendors/bootstrap-plugins/bootstrap-slider.js",              
                "libs/vendors/bootstrap-plugins/bootstrap-switch.js",                  
                "libs/vendors/plugins/fullscreen.js",
                "libs/vendors/materialize/js/materialize.js"]
        },
        defaultInstance: {
            styles: [
                "styles/menu.css",
                "styles/layout.css",
                "styles/loader.css",
                "styles/refactor.css",
                "styles/search.css"
            ]
        }
    }
};
