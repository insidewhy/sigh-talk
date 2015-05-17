import highlightjs from 'highlightjs'
import marked from 'marked'
import _ from 'lodash'

import { all, one } from './utils'
import { highlightActiveMenuItem, initMenu } from './menu'
import { init as initSlides, changeSlide, activateSlide } from './slides'

// livereload
var js = document.createElement('script')
js.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'
document.body.appendChild(js)

marked.setOptions({
  highlight(code) {
    return highlightjs.highlightAuto(code).value
  }
})

function translateMarkdown() {
  var nodes = all('[data-markdown]')
  if (nodes.length === 0)
    return

  for (var node of nodes) {
    var { innerHTML: markdown } = node

    markdown = markdown.replace(/^\n+/, '')
    if (/^ +/.test(markdown)) {
      var nonWsMatch = /[^ ]/.exec(markdown)
      if (nonWsMatch)
        markdown = markdown.split('\n').map(line => line.substr(nonWsMatch.index)).join('\n')
    }

    node.innerHTML = marked(markdown)
    node.removeAttribute('data-markdown')
  }

  // do it again to catch nested markdown
  translateMarkdown()
}

function init() {
  translateMarkdown()
  initSlides()
  initMenu()

  window.addEventListener('keydown', event => {
    if (event.keyCode === 39)
      changeSlide(1)
    else if (event.keyCode === 37)
      changeSlide(-1)
    highlightActiveMenuItem()
  })

  one('body').className = ''
}

if (document.readyState == 'complete' || document.readyState == 'loaded')
  init()
else
  document.addEventListener('DOMContentLoaded', init)
