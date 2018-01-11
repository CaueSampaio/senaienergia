var gulp = require("gulp");

//Plugins
var newer = require("gulp-newer");
var prompt = require("gulp-prompt");

//Img
var imagemin = require("gulp-imagemin");

//html
var htmlclean = require("gulp-htmlclean");
var htmlreplace = require("gulp-html-replace");

//js
var jshint = require("gulp-jshint");
var stripdebug = require("gulp-strip-debug");
var uglify = require("gulp-uglify");
var ngAnnotate = require("gulp-ng-annotate");
var concat = require("gulp-concat");
var gp_rename = require("gulp-rename");
var watch = require("gulp-watch");

//browser-sync
var browserSync = require("browser-sync");

//css
var sass = require("gulp-sass");

var production = "";
var folder = {
  src: "src/",
  build: "build/"
};
var assets = {
  js: [folder.src + "js/**/*.js", folder.src + "app/**/*.js"],
  css: [],
  images: []
  //vendorIn: [Arquivos do nodeModules usados]
};

// //roda eslint
gulp.task("lint", function() {
  console.log("lint: ", assets.js);
  return gulp
    .src(assets.js)
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

//otimizar imagens
gulp.task("images", function() {
  var out = folder.build + "img/";

  return gulp
    .src(folder.src + "img/**/*")
    .pipe(newer(out))
    .pipe(imagemin({ optmizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

//js Angular
gulp.task("jsApp", ["images"], function() {
  var js = gulp.src(folder.src + "js/**/*.js");

  if (production) {
    js = js
      .pipe(stripdebug())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .on("error", function(e) {
        console.log(e);
      });
  }

  return js.pipe(gulp.dest(folder.build + "angular/"));
});

//js Angular My Scripts
gulp.task("myAppFiles", ["jsApp"], function() {
  var js = gulp.src(folder.src + "/app/**/*.js");
  js = js
    .pipe(concat("scripts.js", { newLine: ";" }))
    .pipe(ngAnnotate({ add: true }))
    // .pipe(uglify("scripts.js"))
    //babel uglify
    .on("error", function(e) {
        console.log(e);
    })
    .pipe(gp_rename("scripts.min.js"));

  return js.pipe(gulp.dest(folder.build + "app/"));
});

//js Scripts Concat and Min
gulp.task("jsScriptsMin", ["myAppFiles"], function() {
  var js = gulp.src(folder.src + "/js/**/*.js");
  js = js
    .pipe(concat("all.js"))
    .pipe(uglify("all.js"))
    .on("error", function(e) {
        console.log(e);
    })
    .pipe(gp_rename("all.min.js"));

  return js.pipe(gulp.dest(folder.build + "js/"));
});

//Copiar bibliotecas da pasta node_modules
// gulp.task("copy3rdPart", function() {
//   return gulp
//     .src(assets.vendorIn)
//     .pipe(gulp.dest(folder.build + "node_modules/"));
// });

//Copiar arquivos json
gulp.task("json", function() {
  var json = gulp.src(folder.src + "app/**/*.json");
  var out = folder.build + "app/";

  return json.pipe(gulp.dest(out));
});

//Copiar i18n - internacionalizacao
gulp.task("i18n", ["json"], function() {
  var json = gulp.src("node_modules/angular-i18n/*.js");
  var out = folder.build + "node_modules/angular-i18n/";

  return json.pipe(gulp.dest(out));
});

//HTML Clean (minify)
gulp.task("htmlApp", ["htmlIndex"], function() {
  var html = gulp.src(folder.src + "app/**/*.html");
  var out = folder.build + "app/";

  return production
    ? html.pipe(htmlclean()).pipe(gulp.dest(out))
    : html.pipe(gulp.dest(out));
});

gulp.task("htmlIndex", function() {
  var html = gulp.src(folder.src + "*.html");
  var out = folder.build;

  return production
    ? html
        .pipe(htmlclean())
        .pipe(gulp.dest(out))
        .pipe(browserSync.stream())
    : html.pipe(gulp.dest(out)).pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task("browser-sync", ["sass"], function() {
  browserSync.init({
    injectChanges: true,
    server: {
      baseDir: "./build"
    }
  });
});

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", function() {
  return gulp
    .src(folder.src + "scss/*")
    .pipe(sass())
    .on("error", function(e) {
        console.log(e);
    })
    .pipe(gulp.dest(folder.build + "css"))
    .pipe(browserSync.stream());
});

//fonts
gulp.task("fonts", function() {
  return gulp
    .src(folder.src + "fonts/*.*")
    .pipe(gulp.dest(folder.build + "fonts"));
});

//watch
gulp.task("watch", function() {
  gulp.watch(["./src/**/*.html"], ["htmlIndex", "htmlApp"]);
  gulp.watch(["./src/scss/**/*.scss"], ["sass"]);
  gulp.watch(["./src/**/*.js"], ["myAppFiles"]);
});

gulp.task("run", [
  //   "lint",
  "images",
  "jsApp",
  "myAppFiles",
  "jsScriptsMin",
  //   "copy3rdPart",
  "json",
  "i18n",
  "htmlApp",
  "htmlIndex",
  "browser-sync",
  "fonts",
  "watch"
]);
