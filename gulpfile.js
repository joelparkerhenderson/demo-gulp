///
// Demo of Gulp for JavaScript transformations
//
// This demo shows various ways of using Gulp and related tools:
//
//   * Autoprefixer
//
//   * Tailwind CSS for styles
//
//   * Mustache for HTML web page templates and partials
//
// This demo also shows helpful capabilties:
//
//   * Pino logger
//
//   * Functional tools to unfold asynchronous listings
//
//   * File tools to read directory relative paths and recursive paths.
///

// Require a logger; we prefer the pino logger because it's fast and easy.
const logger = require('pino')()
logger.info('Gulp...')

// Require path tools, such as for directory name and file names.
const path = require ('path')

// Require filesystem tools, such as how to read a directory.
const fs = require('fs')

// Require gulp and related tools
const gulp = require('gulp')
const gulp_concat = require('gulp-concat')
const gulp_mustache = require('gulp-mustache')
const gulp_postcss = require('gulp-postcss')

///
// Functional helpers
//
// These are not currently used in this demo; 
// these are for people who want to extend this demo.
///

// Nickname for a nonexistent item
const None = Symbol()

// Unfold is for functional asyncrhonous expansion
const unfold = (f, initState) =>
    f ( (value, nextState) => [ value, ...unfold (f, nextState) ]
        , () => []
        , initState
    )

///
// File helpers
//
// These are not currently used in this demo; 
// these are for people who want to extend this demo.
///

// Read a directory and return its relative paths.
const readdirRelative = (dir = '.') =>
    fs.readdirSync(dir).map(x => path.join(dir, x))


// Read a directory recursively, and return its relative paths.
const readdirRecursive = (dir) =>
    unfold((next, done, [ path = None, ...rest ]) =>
        path === None
            ? done()
            : next(path, 
                fs.statSync(path).isDirectory()
                    ? readdirRelative(path).concat(rest)
                    : rest
            )
        , relativePaths(dir)
    )

///
// Configuration
//
// We prefer to do configuration via a config object,
// rather than doing configuration in each gulp task.
///

let config = {
    paths: {
        src: {
            html: [
                './src/html/**/*.html'
            ],
            images: [
                './src/assets/images/**/*.{jpg,png,svg}'
            ],
            styles: [
                './src/assets/styles/**/*.css'
            ],
            templates: [
                './src/templates/**/*.html'
            ]
        },
        dist: {
            html: './dist/html',
            images: './dist/assets/images',
            styles: './dist/assets/styles',
            templates: './dist/templates'
        }
    }
};

///
// Process
///

// Process HTML files: copy from src to dst
function html(cb) {
    gulp.src(config.paths.src.html)
        .pipe(gulp.dest(config.paths.dist.html))
    cb()
}

// Process image files: copy from src to dst
function images(cb) {
    gulp.src(config.paths.src.images)
        .pipe(gulp.dest(config.paths.dist.images))
    cb()
}

// Process template files: use mustache to reify HTML templates
function templates(cb) {
    gulp.src(config.paths.src.templates)
    .pipe(gulp_mustache())
    .pipe(gulp.dest(config.paths.dist.templates))
    cb()
}

// Process style files: use Tailwind CSS and Autoprefix
function styles(cb) {
    gulp.src(config.paths.src.styles)
        .pipe(gulp_postcss([
            require('tailwindcss'),
            require('autoprefixer'),
        ]))
        .pipe(gulp.dest(config.paths.dist.styles))
    cb()
}

exports.html = html;
exports.images = images;
exports.styles = styles;
exports.templates = templates;
