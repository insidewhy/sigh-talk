import { all, one } from './utils'
import { allSlides, activeIndex } from './slides'
import { activateSlide } from './slides'

export function highlightActiveMenuItem() {
  var listItems = all('aside ul li')
  var activateIdx = activeIndex()

  listItems.forEach((li, idx) => {
    li.className = idx === activateIdx ? 'active' : ''
  })
}

export function initMenu() {
  var slideUl = one('aside ul')
  allSlides.forEach(slide => {
    var li = document.createElement('li')
    li.innerHTML = slide.replace(/-/g, ' ')
    slideUl.appendChild(li)

    li.onclick = () => {
      activateSlide(slide)
      highlightActiveMenuItem()
    }
  })

  highlightActiveMenuItem()
}
