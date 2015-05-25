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
    var { onIdx, offIdx } = parseSequence(seqNode)
    seqNode.style.display = 'none'

    if (onIdx !== undefined)
      sequences.add(onIdx, { type: 'on', node: seqNode })
    if (offIdx !== undefined)
      sequences.add(offIdx, { type: 'off', node: seqNode })
  }

  activateSequence(true)
}

function parseSequence(node) {
  var seqs = node.dataset.seq.split('-')
  var onIdx = seqs[0] || 0

  // TODO:
  // if (seqs.length === 1)
  //   seqs[1] = parseInt(seqs[1]) + 1

  var offIdx
  if (seqs[1] !== undefined)
    offIdx = seqs[1]

  return { onIdx, offIdx }
}

// activates sequences at sequenceIdx
function activateSequence(activate) {
  var seq = sequences.get(sequenceIdx)
  if (seq)
    seq.forEach(({type, node}) => {
      if (type === (activate ? 'on' : 'off'))
        node.style.display = ''
      else
        node.style.display = 'none'
    })
}

export function changeSlide(offset) {
  var nextSequence = sequenceIdx + offset
  if (offset > 0 && nextSequence < sequences.length) {
    for (++sequenceIdx; sequenceIdx < nextSequence; ++sequenceIdx)
      activateSequence(true)
    activateSequence(true)
  }
  else if (offset < 0 && nextSequence >= 0) {
    for (; sequenceIdx > nextSequence; --sequenceIdx) {
      activateSequence(false)
    }
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
