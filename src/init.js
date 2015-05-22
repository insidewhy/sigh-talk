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
    var [ first, second, duration = 1000 ] = node.dataset.marquee.split(':')

    console.log("poo", duration)

    node.animate([
      { left: first },
      { left: second },
    ], { duration, direction: 'alternate', iterations: 9999999 })
  }

  for (var node of all('[data-blink]')) {
    node.animate([
      { opacity: '0' },
      { opacity: '1' },
    ], {
      duration: 400,
      direction: 'alternate',
      iterations: 9999999,
      easing: 'step-middle'
    })
  }
}

function runImports() {
  var links = all('link[rel="import"]')
  links.forEach(link => {
    var nodes = all(link.import, 'body >*')
    nodes.forEach(node => {
      link.parentNode.insertBefore(node, link)
    })
  })
}

function init() {
  marked.setOptions({
    highlight(code) {
      // to avoid double escaping
      code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      return highlightjs.highlightAuto(code).value
    }
  })

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
    highlightActiveMenuItem()
  })

  one('body').className = ''
}

if (document.readyState == 'complete' || document.readyState == 'loaded')
  init()
else
  document.addEventListener('DOMContentLoaded', init)
