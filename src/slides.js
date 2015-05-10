import { all, one } from './utils'

// the class names of all slides in order
export var allSlides = []
var activeSlide = ''

function activateSlide(name, style = '') {
  if (style === '') {
    activeSlide = name
    window.localStorage.setItem('active', name)
  }
  one(`.${name}`).style.display = style
}

function changeSlide(offset) {
  var activeIdx = allSlides.indexOf(activeSlide)
  activeIdx += offset
  if (activeIdx >= 0 && activeIdx < allSlides.length) {
    activateSlide(activeSlide, 'none')
    activateSlide(allSlides[activeIdx])
  }
}

export function init(parentSelector = 'body') {
  var sections = all(`${parentSelector}>section`)
  allSlides = sections.map(node => node.className.split(' ')[0])

  window.addEventListener('keyup', event => {
    if (event.keyCode === 39)
      changeSlide(1)
    else if (event.keyCode === 37)
      changeSlide(-1)
  })

  sections.forEach(section => { section.style.display = 'none' })
  activateSlide(window.localStorage.getItem('active') || 'intro')
}
