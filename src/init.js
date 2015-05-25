import highlightjs from 'highlightjs'
import marked from 'marked'
import _ from 'lodash'

import { all, one } from './utils'
import { highlightActiveMenuItem, initMenu } from './menu'
import { init as initSlides, changeSlide } from './slides'

// livereload
var js = document.createElement('script')
js.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'
document.body.appendChild(js)

function translateMarkdown() {
  for (var node of all('[data-markdown]')) {
    var { innerHTML: markdown } = node

    markdown = markdown.replace(/^\n+/, '')
    if (/^ +/.test(markdown)) {
      var nonWsMatch = /[^ ]/.exec(markdown)
      var repl = new RegExp(`^ {${nonWsMatch.index}}`)

      if (nonWsMatch)
        markdown = markdown.split('\n').map(line => line.replace(repl, '')).join('\n')
    }

    node.innerHTML = marked(markdown)
    node.removeAttribute('data-markdown')
  }
}

function initEffects() {
  for (var node of all('[data-marquee]')) {
    var { marquee } = node.dataset
    var [ first = '-100px',
          second = '100px',
          duration = 1000 ] = marquee ? marquee.split(':') : []

    if (node.animate)
      node.animate([
        { left: first },
        { left: second },
      ], { duration, direction: 'alternate', iterations: 9999999 })
  }

  for (var node of all('[data-blink]')) {
    if (node.animate)
      node.animate([ { opacity: '0' }, { opacity: '1' }, ], {
        duration: node.dataset.blink || 400,
        direction: 'alternate',
        iterations: 9999999,
        easing: 'step-middle'
      })
  }
}

function showWarningToUnsupportedBrowser() {
  var div = document.createElement('div')
  if (! div.animate)
    one('.intro .warning').style.display = 'block'
}

function runImports() {
  var links = all('link[rel="import"]')
  links.forEach(link => {
    if (! link.import) {
      // TODO: load using ajax for browsers that don't support html5 imports
      return
    }

    var nodes = all(link.import, 'body >*')
    nodes.forEach(node => {
      link.parentNode.insertBefore(node, link)
    })
  })
}

function toggleFullScreen() {
  if (! document.fullscreenElement &&
      ! document.mozFullScreenElement &&
      ! document.webkitFullscreenElement &&
      ! document.msFullscreenElement )
  {
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen()
    else if (document.documentElement.msRequestFullscreen)
      document.documentElement.msRequestFullscreen()
    else if (document.documentElement.mozRequestFullScreen)
      document.documentElement.mozRequestFullScreen()
    else if (document.documentElement.webkitRequestFullscreen)
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
  }
  else {
    if (document.exitFullscreen)
      document.exitFullscreen()
    else if (document.msExitFullscreen)
      document.msExitFullscreen()
    else if (document.mozCancelFullScreen)
      document.mozCancelFullScreen()
    else if (document.webkitExitFullscreen)
      document.webkitExitFullscreen()
  }
}

function init() {
  marked.setOptions({
    highlight(code) {
      // to avoid double escaping
      code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      return highlightjs.highlightAuto(code).value
    }
  })

  showWarningToUnsupportedBrowser()
  runImports()
  translateMarkdown()
  initEffects()
  initSlides()
  initMenu()

  window.addEventListener('keydown', event => {
    if (event.keyCode === 39)
      changeSlide(1)
    else if (event.keyCode === 37)
      changeSlide(-1)
    else if (event.keyCode === 70)
      toggleFullScreen()

    highlightActiveMenuItem()
  })

  one('body').className = ''
}

if (document.readyState == 'complete' || document.readyState == 'loaded')
  init()
else
  document.addEventListener('DOMContentLoaded', init)
