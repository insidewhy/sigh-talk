import showdown from 'showdown'
import _ from 'lodash'

import { all, one } from './utils'
import { init as initSlides, allSlides, changeSlide, activateSlide, activeIndex } from './slides'

// livereload
var js = document.createElement('script')
js.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'
document.body.appendChild(js)

function translateMarkdown() {
  var converter = new showdown.converter()
  for (var node of all('[data-markdown]')) {
    var { innerHTML: markdown } = node

    markdown = markdown.replace(/^\n+/, '')
    if (/^ +/.test(markdown)) {
      var nonWsMatch = /[^ ]/.exec(markdown)
      if (nonWsMatch)
        markdown = markdown.split('\n').map(line => line.substr(nonWsMatch.index)).join('\n')
    }

    node.innerHTML = converter.makeHtml(markdown)
  }
}

// init
function init() {
  translateMarkdown()
  initSlides()

  var slideUl = one('aside ul')
  allSlides.forEach(slide => {
    var li = document.createElement('li')
    li.innerHTML = slide.replace('-', ' ')
    slideUl.appendChild(li)

    li.onclick = () => {
      activateSlide(slide)
      activateMenuItem()
    }
  })

  var activateMenuItem = () => {
    var listItems = all('aside ul li')
    var activateIdx = activeIndex()

    listItems.forEach((li, idx) => {
      li.className = idx === activateIdx ? 'active' : ''
    })
  }

  window.addEventListener('keydown', event => {
    if (event.keyCode === 39)
      changeSlide(1)
    else if (event.keyCode === 37)
      changeSlide(-1)
    activateMenuItem()
  })
  activateMenuItem()

  one('body').className = ''
}

if (document.readyState == 'complete' || document.readyState == 'loaded')
  init()
else
  document.addEventListener('DOMContentLoaded', init)
