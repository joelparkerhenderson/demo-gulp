// Demo of Gulp for JavaScript transformations

// Require a logger; we prefer the pino logger because it's fast and easy.
const logger = require('pino')()
logger.info('Gulp...')

// Require path tools, such as for directory name and file names.
const path = require ('path')

// Require filesystem tools, such as how to read a directory.
const fs = require('fs')

// Require gulp and related tools
const gulp = require('gulp')
const gulp_postcss = require('gulp-postcss')

///
// Functional helpers
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
///

let config = {
    paths: {
        src: {
            css: './src/assets/styles'
        },
        dst: {
            css: './dist/assets/styles'
        }
    }
};

///
// Process
///

// Process one CSS file, from a source file path to a destination file path.
function css_helper(src_file, dst_file) {
    gulp.src(src_file)
        .pipe(gulp_postcss([
            require('tailwindcss'),
            require('autoprefixer'),
        ]))
        .pipe(gulp.dest(path.dirname(dst_file)))
}

// Process all CSS files, from source file paths to destination file paths.
function css(cb) {
    let src_path = config.paths.src.css
    let dst_path = config.paths.dst.css
    readdirRecursive(src_path)
    .filter(sub_path => sub_path.endsWith(".css"))
    .map(sub_path => sub_path.substring(src_path.length - 1))
    .forEach(sub_path => {
        logger.info('sub_path:' + sub_path)
        css_helper(path.join(src_path, sub_path), path.join(dst_path, sub_path))
    })
    cb()
}

exports.css = css;
