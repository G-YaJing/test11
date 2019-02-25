var gulp = require("gulp");
var webserver = require("gulp-webserver");

//开启服务
gulp.task("webserver", function() {
    return gulp.src("./src")
        .pipe(webserver({
            open: true,
            port: 8000,
            livereload: true,
            proxies: [
                { source: "/api/find", target: "http://localhost:3000/api/find" },
                { source: "/api/insert", target: "http://localhost:3000/api/insert" },
                { source: "/api/mohu", target: "http://localhost:3000/api/mohu" },
                { source: "/api/remove", target: "http://localhost:3000/api/remove" },
                { source: "/api/update", target: "http://localhost:3000/api/update" },
                { source: "/api/findPage", target: "http://localhost:3000/api/findPage" }
            ]
        }))
})