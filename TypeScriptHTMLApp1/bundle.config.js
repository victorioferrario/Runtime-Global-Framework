module.exports = {
    bundle: {
        vendor: {
            styles:[
                "styles/menu.css",
                  "styles/layout.css",
                  "libs/vendors/tooltip/tooltip.css",
                  "dist/admin.vendor.css"
            ],
            scripts: [
                 "libs/vendors/jquery-2.2.3.min.js",
                  "libs/vendors/jquery.nanoscroller.min.js",
                  "libs/vendors/knockout-3.4.0.js",
                  "libs/vendors/knockout-postbox.js",
                  "libs/vendors/knockout.mapping.js",
                  "libs/vendors/fullscreen.js",
                  "libs/vendors/tooltip/tooltip.min.js"
            ]
        }
    }
};
