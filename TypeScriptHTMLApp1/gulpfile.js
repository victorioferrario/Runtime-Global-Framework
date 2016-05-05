var gulp = require("gulp"),
    merge = require("merge2"),
    ts = require("gulp-typescript"),
    bundle = require("gulp-bundle-assets");

var tsProject = ts.createProject({
    //-----------------------------------------

    declaration: true,
    noImplicitAny: true,
    noExternalResolve: false,

    //-----------------------------------------

    out: "copley.app.navigation.js"

    //---------------------------------------

});

gulp.task("scripts", function () {

    var tsResult = gulp.src(["src/**/*.ts", "src/**/*.tsx"])
        .pipe(ts(tsProject));
    return merge([
        tsResult.js.pipe(gulp.dest("dist"))
    ]);

});

gulp.task("bundle", function() {
    return gulp.src("./bundle.config.js")
        .pipe(bundle())
        .pipe(gulp.dest("dist"));
});
gulp.task("watch", ["scripts"], function() {
    gulp.watch("src/**/*.ts", ["scripts"]);
});
