var gulp = require('gulp'),
    mincss = require('gulp-mini-css'),
    uglify = require('gulp-uglify');

// 压缩CSS文件
gulp.task('mincss', function () {
    gulp.src('client/stylesheets/*.css')
        .pipe(mincss())
        .pipe(gulp.dest("public/stylesheets"));
});

// 压缩混淆JS文件
gulp.task('minjs', function () {
    gulp.src('client/javascripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest("public/javascripts"));
});

//拷贝HTML文件
gulp.task('html', function () {
    gulp.src('client/*.html')
        .pipe(gulp.dest("public"));
});

//监视文件变化，自动打包
gulp.task('watch', function () {
    gulp.watch('client/stylesheets/*.css',['mincss']);
    gulp.watch('client/javascripts/*.js', ['minjs']);
    gulp.watch('client/*.html',['html']);
});

// 启动时默认进行一次打包
gulp.task('default',['minjs','mincss','html','watch'],function(){
});