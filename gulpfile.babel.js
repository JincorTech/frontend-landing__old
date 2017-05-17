import gulp from 'gulp'
import bs from 'browser-sync'
import plumber from 'gulp-plumber'
import file from 'gulp-file'

import pug from 'gulp-pug'

import postcss from 'gulp-postcss'
import atImport from 'postcss-import'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'
import pcInlineSvg from 'postcss-inline-svg'
import pcShort from 'postcss-short'
import precss from 'precss'

import browserify from 'gulp-browserify'
import babelify from 'babelify'

import image from 'gulp-image'


gulp.task('pug', () => gulp
  .src('./src/*.pug')
  .pipe(plumber())
  .pipe(pug())
  .pipe(gulp.dest('./static')));

gulp.task('css', () => {
  const plugins = [
    atImport(),
    precss(),
    cssnext({browsers: ['last 2 version']}),
    cssnano(),
    pcInlineSvg(),
    pcShort()
  ];

  return gulp.src('./src/*.css')
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./static'))
});

gulp.task('js', () => gulp
  .src('./src/**/*.js')
  .pipe(browserify({
    transform: babelify.configure({ presets: ['es2015'] })
  }))
  .pipe(gulp.dest('./static')));

gulp.task('img', () => gulp
  .src('src/images/*')
  .pipe(gulp.dest('./static')));


gulp.task('watch', () => {
  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch('src/**/*.css', ['css']);
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/images/*', ['img']);
});

gulp.task('browser-sync', () => {
  bs.init(['static/**/*'], {
    server: {
      baseDir: './static'
    }
  })
});

gulp.task('default', [
  'pug',
  'css',
  'js',
  'img',
  'watch',
  'browser-sync'
]);