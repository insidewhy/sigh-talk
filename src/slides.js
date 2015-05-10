import { all, one } from './utils'

// the class names of all slides in order
export var allSlides = []
var activeSlide

export function activateSlide(name) {
  if (activeSlide)
    one(`.${activeSlide}`).style.display = 'none'

  activeSlide = name
  window.localStorage.setItem('active', name)
  one(`.${name}`).style.display = ''
}

export function changeSlide(offset) {
  var activeIdx = allSlides.indexOf(activeSlide)
  activeIdx += offset
  if (activeIdx >= 0 && activeIdx < allSlides.length)
    activateSlide(allSlides[activeIdx])
}

export function activeIndex() {
  return allSlides.indexOf(activeSlide)
}

export function init(parentSelector = 'body') {
  var sections = all(`${parentSelector}>section`)
  allSlides = sections.map(node => node.className.split(' ')[0])

  sections.forEach(section => { section.style.display = 'none' })
  activateSlide(window.localStorage.getItem('active') || 'intro')
}
