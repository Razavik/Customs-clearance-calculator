const gulp = require("gulp")

require("./gulp/dev")
require("./gulp/docs")

gulp.task("default", gulp.series(
    "clean:dev",
    gulp.parallel("includes:dev", "sass:dev", "images:dev", "fonts:dev", "js:dev"),
    gulp.parallel("server:dev", "watch:dev")
))

gulp.task("build", gulp.series(
    "clean:docs",
    gulp.parallel("includes:docs", "sass:docs", "images:docs", "fonts:docs", "js:docs"),
    gulp.parallel("server:docs")
))