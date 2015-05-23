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
        // or with less parallelism:
        // glob(globOpts, '*.js', 'app.scss'),
        // sass(),
        // babel(),
        write({ clobber: '!(jspm_packages)' }, 'build'),
      ],
      glob('index.html', 'config.js')
    ),
    livereload()
  ]

  pipelines.server = [
    glob('server.js'),
    process('node server.js')
  ]
}
