const gulp = require("gulp")

//CSS
const sourseMaps = require("gulp-sourcemaps")
const scss = require("gulp-sass")(require("sass"))
const scssGlob = require("gulp-sass-glob")

//HTML
const fileInclude = require("gulp-file-include")

//JS
const babel = require("gulp-babel")
const webpack = require("webpack-stream")

//OTHER
const server = require("gulp-server-livereload")
const clean = require("gulp-clean")
const fs = require("fs")
const plumber = require("gulp-plumber")
const newer = require("gulp-newer") 

//TASKS
gulp.task("includes:dev", () => {
    return gulp
        .src("./src/*.html")
        .pipe(fileInclude({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(gulp.dest("./build/"))
})

gulp.task("sass:dev", () => {
    return gulp
    .src("./src/scss/main.scss")
    .pipe(sourseMaps.init())
    .pipe(scssGlob())
    .pipe(scss())
    .pipe(sourseMaps.write())
    .pipe(gulp.dest("./build/css/"))
})

gulp.task("images:dev", () => {
    return gulp
    .src("./src/images/**/*")
    .pipe(newer("./build/images/"))
    .pipe(gulp.dest("./build/images"))
})

gulp.task("clean:images:dev", () => {
    return gulp
    .src("./build/images/**/*", { read: false })
    .pipe(clean())
})

gulp.task("fonts:dev", () => {
    return gulp
    .src("./src/fonts/**/*")
    .pipe(newer("./build/fonts/"))
    .pipe(gulp.dest("./build/fonts"))
})

gulp.task("clean:fonts:dev", () => {
    return gulp
    .src("./build/images/**/*", { read: false })
    .pipe(clean())
})

gulp.task("server:dev", () => {
    return gulp
    .src("./build/")
    .pipe(server({
        livereload: true,
        open: true,
        port: 8080
    }))
})

gulp.task("clean:dev", (done) => {
    if (fs.existsSync("./build/")) {
        return gulp
        .src("./build/", { read: false })
        .pipe(clean())
    }

    done();
})

gulp.task("js:dev", () => {
    return gulp
    .src("./src/js/screens/*.js")
    .pipe(plumber())
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(webpack(require("../webpack.config")))
    .pipe(gulp.dest("./build/js"))
})

gulp.task("watch:dev", () => {
    gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"))
    gulp.watch("./src/**/*.html", gulp.parallel("includes:dev"))
    gulp.watch("./src/images/**/*", gulp.series("clean:images:dev", "images:dev"))
    gulp.watch("./src/fonts/**/*", gulp.series("clean:fonts:dev", "fonts:dev"))
    gulp.watch("./src/js/**/*", gulp.parallel("js:dev"))
})