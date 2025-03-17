const gulp = require("gulp")

//CCS
const autoPrefixer = require("gulp-autoprefixer")
const groupMedia = require("gulp-group-css-media-queries")
const scss = require("gulp-sass")(require("sass"))
const webpcss = require("gulp-webp-css")
const csso = require("gulp-csso")
const scssGlob = require("gulp-sass-glob")

//HTML
const fileInclude = require("gulp-file-include")
const webpHTML = require("gulp-webp-html")
const htmlClean = require("gulp-htmlclean")

//IMAGES
const webp = require("gulp-webp")
const imageMin = require("gulp-imagemin")

//JS
const webpack = require("webpack-stream")

//OTHER
const server = require("gulp-server-livereload")
const clean = require("gulp-clean")
const fs = require("fs")
const plumber = require("gulp-plumber")
const newer = require("gulp-newer")

//TASKS
gulp.task("includes:docs", () => {
    return gulp
        .src("./src/*.html")
        .pipe(fileInclude({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(htmlClean())
        .pipe(webpHTML())
        .pipe(gulp.dest("./docs/"))
})

gulp.task("sass:docs", () => {
    return gulp
    .src("./src/scss/main.scss")
    .pipe(scssGlob())
    .pipe(autoPrefixer())
    .pipe(groupMedia())
    .pipe(scss())
    .pipe(webpcss())
    .pipe(csso())
    .pipe(gulp.dest("./docs/css/"))
})

gulp.task("images:docs", () => {
    return gulp
    .src("./src/images/**/*")
    .pipe(newer("./docs/images/"))
    .pipe(webp())
    .pipe(gulp.dest("./docs/images/"))
    .pipe(gulp.src("./src/images/**/*"))
    .pipe(newer("./docs/images/"))
    .pipe(imageMin())
    .pipe(gulp.dest("./docs/images/"))
})

gulp.task("clean:images:docs", () => {
    return gulp
    .src("./docs/images/**/*", { read: false })
    .pipe(clean())
})

gulp.task("fonts:docs", () => {
    return gulp
    .src("./src/fonts/**/*")
    .pipe(newer("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts"))
})

gulp.task("clean:fonts:docs", () => {
    return gulp
    .src("./docs/images/**/*", { read: false })
    .pipe(clean())
})

gulp.task("server:docs", () => {
    return gulp
    .src("./docs/")
    .pipe(server({
        livereload: true,
        open: true,
        port: 8080
    }))
})

gulp.task("clean:docs", (done) => {
    if (fs.existsSync("./docs/")) {
        return gulp
        .src("./docs/", { read: false })
        .pipe(clean())
    }

    done();
})

gulp.task("js:docs", () => {
    return gulp
    .src("./src/js/screens/*.js")
    .pipe(plumber())
    .pipe(webpack(require("../webpack.config")))
    .pipe(gulp.dest("./docs/js"))
})