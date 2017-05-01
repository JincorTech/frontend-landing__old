import gulp from 'gulp'
import bs from 'browser-sync'

import pug from 'gulp-pug'

import postcss from 'gulp-postcss'
import atImport from 'postcss-import'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'
import pcInlineSvg from 'postcss-inline-svg'
import pcShort from 'postcss-short'
import precss from 'precss'


gulp.task('pug', () => gulp
  .src('./src/*.pug')
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
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./static'))
});





gulp.task('watch', () => {
  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch('src/**/*.css', ['css']);
});

gulp.task('browser-sync', () => {
  bs.init(['static/**/*'], {
    server: {
      baseDir: './static'
    }
  })
});

gulp.task('default', [
  'watch',
  'browser-sync'
]);