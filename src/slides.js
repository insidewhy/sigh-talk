import { all, one } from './utils'
import ArrayOfArrays from './array-of-arrays'

// the class names of all slides in order
export var allSlides = []
// name of active slide
var activeSlide

// activations within slide
var sequences
var sequenceIdx

export function activateSlide(name) {
  if (activeSlide)
    one(`.${activeSlide}`).style.display = 'none'

  activeSlide = name
  window.localStorage.setItem('active', name)
  var slide = one(`.${name}`)
  slide.style.display = ''

  sequenceIdx = 0
  sequences = new ArrayOfArrays
  for (var seqNode of all(slide, '[data-seq]')) {
    var { on, off } = parseSequence(seqNode)
    seqNode.style.display = 'none'

    if (on)
      sequences.add(on.idx, on.call)
    if (off)
      sequences.add(off.idx, off.call)
  }

  activateSequence()
}

function parseSequence(node) {
  var seqs = node.dataset.seq.split('-')
  var on = {
    call() { node.style.display = '' },
    idx: seqs[0] || 0
  }

  if (seqs.length === 1)
    seqs[1] = parseInt(seqs[2]) + 1

  var off = seqs[1] && {
    call() { node.style.display = 'none' },
    idx: seqs[1]
  }

  return { on, off }
}

// activates sequences at sequenceIdx
function activateSequence() {
  var seq = sequences.get(sequenceIdx)
  if (seq)
    seq.forEach(call => { call() })
}

export function changeSlide(offset) {
  var nextSequence = sequenceIdx + offset
  if (offset > 0 && nextSequence < sequences.length) {
    for (++sequenceIdx; sequenceIdx < nextSequence; ++sequenceIdx)
      activateSequence()
    activateSequence()
  }
  else {
    var activeIdx = allSlides.indexOf(activeSlide)
    activeIdx += offset
    if (activeIdx >= 0 && activeIdx < allSlides.length)
      activateSlide(allSlides[activeIdx])
  }
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
