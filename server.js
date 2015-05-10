var PORT = process.env.PORT || 4926;

var serveStatic = require('serve-static')
var app = require('express')()

app.use(serveStatic('.', { index: 'index.html' }))

app.listen(PORT, function() {
  console.log('Listening on port', PORT);
})
