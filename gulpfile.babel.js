import gulp from 'gulp'
import bs from 'browser-sync'

import pug from 'gulp-pug'

import postcss from 'gulp-postcss'
import pImport from 'postcss-import'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'



gulp.task('pug', () => gulp
  .src('./src/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('./static')));

gulp.task('css', () => {
  const plugins = [
    pImport(),
    cssnext({browsers: ['last 2 version']}),
    cssnano()
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