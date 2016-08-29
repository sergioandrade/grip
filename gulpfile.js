var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var concat      = require('gulp-concat');


var paths = {
    scripts: {
        'src': [
            ''
        ],
        'dist': './assets/js/dist/',
    },
    styles: {
        'src': [
            './assets/scss/**/*.scss'
        ],
        'dist': './assets/css/',
    },
    html: {
        'src': [
            './*.html',
            './*.html'
        ]
    },
}





var displayError = function(error) {

    // Initial building up of the error
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

    // If the error contains the filename or line number add it to the string
    if(error.fileName)
        errorString += ' in ' + error.fileName;

    if(error.lineNumber)
        errorString += ' on line ' + error.lineNumber;

    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    console.error(errorString);
}


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
     browserSync.init({
        server: "./",
        ghostMode: false,
        notify: {
            styles: {
                "bottom": '10px',
                "right": '10px',
                "top": 'auto',
                "border-radius": 0
            }
        }
    });
    gulp.watch(paths.styles.src, ['sass']);
    gulp.watch(paths.html.src).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    gulp.src(paths.styles.src)
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .on('error', function(err){
        displayError(err);
    })
    .pipe(prefix(
        'last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
    ))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(browserSync.stream());
});


gulp.task('default', ['serve'], function() {
    gulp.watch(paths.styles.src)
    .on('change', function(evt) {
        console.log(
            '[watcher] File ' + evt.path.replace(/.*(?=sass)/,'') + ' was ' + evt.type + ', compiling...'
        );
    });
});