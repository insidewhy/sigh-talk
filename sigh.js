var glob, babel, sass, write, livereload, process

module.exports = function(pipelines) {
  var globOpts = { basePath: 'src' }

  pipelines.build = [
    merge(
      [
        merge(
          [ glob(globOpts, '*.js'), babel() ],
          [ glob(globOpts, 'app.scss'), sass() ]
        ),
        write({ clobber: '!(jspm_packages)' }, 'build'),
      ],
      glob('index.html', 'config.js')
    ),
    livereload()
  ]

  pipelines.run = [ process('node server.js') ]

  // [
  //   glob(glopOpts, '*.js', 'app.scss'),
  //   sass(),
  //   babel(),
  //   write({ clobber: '!(jspm_packages)' }, 'build')
  // ],
}
