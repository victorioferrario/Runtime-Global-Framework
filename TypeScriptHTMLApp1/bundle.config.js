module.exports = {
    bundle: {
        vendor: {
            styles: [
                "libs/css/google.material.css",
                "libs/css/google.roboto.css",
                "libs/css/animate.css",
                // "dist/admin.vendor.css",
                "libs/vendor/waves.css"
                // "libs/bootstrap/bootstrap-3.3.6-dist/css/bootstrap.min.css"
                ],
            scripts: [
                // "libs/vendors/jquery-2.2.3.min.js",
                "libs/vendors/knockout-3.4.0.js",
                "libs/vendors/knockout-postbox.js",
                "libs/vendors/knockout.mapping.js",
                // "libs/bootstrap/bootstrap-3.3.6-dist/js/bootstrap.js",                
                "libs/vendors/fullscreen.js",
                "libs/materialize/js/materialize.js"]
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
