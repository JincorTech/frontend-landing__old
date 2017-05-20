import gulp from 'gulp'
import fs from 'fs'
import bs from 'browser-sync'
import plumber from 'gulp-plumber'
import file from 'gulp-file'

import pug from 'gulp-pug'

import postcss from 'gulp-postcss'
import atImport from 'postcss-import'
import cssnext from 'postcss-cssnext'
import cssnano from 'gulp-cssnano'
import pcInlineSvg from 'postcss-inline-svg'
import pcShort from 'postcss-short'
import precss from 'precss'

import browserify from 'gulp-browserify'
import babelify from 'babelify'
import uglify from 'gulp-uglify'

import image from 'gulp-image'
import realFavicon from 'gulp-real-favicon'


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
    pcInlineSvg(),
    pcShort()
  ];

  return gulp.src('./src/*.css')
    .pipe(plumber())
    .pipe(postcss(plugins))
		.pipe(cssnano())
    .pipe(gulp.dest('./static'))
});

gulp.task('js', () => gulp
  .src('./src/**/*.js')
  .pipe(browserify({
    transform: babelify.configure({ presets: ['es2015'] })
  }))
	.pipe(uglify())
  .pipe(gulp.dest('./static')));

gulp.task('img', () => gulp
  .src('./src/images/*')
  .pipe(image())
  .pipe(gulp.dest('./static')));


const FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('generate-favicon', done => {
	realFavicon.generateFavicon({
		masterPicture: './src/favicon.png',
		dest: './static/favicons',
		iconsPath: './static/favicons',
		design: {
			ios: {
				pictureAspect: 'noChange',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#da532c',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#fff'
			}
		},
		settings: {
			compression: 2,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, () => {
		done();
	});
});

// TODO FIX THAT TASK!
// gulp.task('inject-favicon-markups', () => gulp
//   .src(['./static/index.html'])
//   .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
//   .pipe(gulp.dest('./static')));

// gulp.task('check-for-favicon-update', function(done) {
// 	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
// 	realFavicon.checkForUpdates(currentVersion, function(err) {
// 		if (err) {
// 			throw err;
// 		}
// 	});
// });


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

gulp.task('build', [
	'pug',
	'css',
	'js',
	'img'
])

gulp.task('default', [
  'pug',
  'css',
  'js',
  'img',
  'watch',
  'browser-sync'
]);