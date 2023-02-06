// const PROD = import.meta.env.PROD

const appInitial = 'game'
// const seed = 1235
const seed = null

const mainDisplayWidth = 69
const mainDisplayHeight = 35

const messageDisplayWidth = 69
const messageDisplayHeight = 35
const messageBufferDisplaySize = 5

const generateWidth = 103 // approx 1.5 times graphical display size
const generateHeight = 53

const setMainToMapSize = false

// '#111a0e'
const mainBackgroundColor = '#000000'
const messageColor = '#FFF'
const messageBackgroundColor = 'transparent'
const htmlBackgroundColor = '#000000'

const frameLimit = 0
const recallAll = false
const revealAll = localStorage.getItem('revealAll') === 'true'

const initialDomain = parseInt(localStorage.getItem('initialDomain') ?? '2')

const autoStartVisualizer = true
const visualizerAutoClose = true

const CONFIG = {
  appInitial,
  seed,
  mainDisplayWidth,
  mainDisplayHeight,
  messageDisplayWidth,
  messageDisplayHeight,
  messageBufferDisplaySize,
  generateWidth,
  generateHeight,
  setMainToMapSize,
  mainBackgroundColor,
  messageColor,
  messageBackgroundColor,
  htmlBackgroundColor,
  frameLimit,
  recallAll,
  revealAll,
  initialDomain,
  autoStartVisualizer,
  visualizerAutoClose,
}

export { CONFIG }
