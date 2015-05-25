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
    var seqs = parseSequence(seqNode)
    seqNode.style.display = 'none'

    seqs.forEach(seq => {
      sequences.add(seq.idx, { type: seq.type, node: seqNode })
    })
  }

  activateSequence(true)
}

function parseSequence(node) {
  var seqs = []
  var seqDescs = node.dataset.seq.split('-')

  // format: "number"
  if (seqDescs.length === 1) {
    seqs.push({ idx: seqDescs[0] || 0, type: 'once' })
  }
  else {
    seqs.push({ idx: seqDescs[0] || 0, type: 'on' })

    // if not format "number-"
    if (seqDescs[1] !== undefined)
      seqs.push({ idx: seqDescs[1], type: 'off' })
  }

  return seqs
}

// activates sequences at sequenceIdx
function activateSequence(activate) {
  if (activate && sequenceIdx > 0) {
    // deactivate 'once' items from previous index
    var prevSeqs = sequences.get(sequenceIdx - 1)
    if (prevSeqs) {
      prevSeqs.forEach(({type, node}) => {
        if (type === 'once')
          node.style.display = 'none'
      })
    }
  }

  var seqs = sequences.get(sequenceIdx)
  if (seqs)
    seqs.forEach(({type, node}) => {
      if ((! activate && type === 'off') || (activate && (type === 'on' || type === 'once')))
        node.style.display = ''
      else
        node.style.display = 'none'
    })
}

export function changeSlide(offset) {
  var nextSequence = sequenceIdx + offset
  if (offset > 0 && nextSequence < sequences.length) {
    // activate skipped sequences
    for (++sequenceIdx; sequenceIdx < nextSequence; ++sequenceIdx)
      activateSequence(true)

    // activate final sequence
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
