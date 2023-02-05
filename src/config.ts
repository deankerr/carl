// const PROD = import.meta.env.PROD

const appInitial = 'game'
const seed = 123
// const seed = null

// 59 x 29 | 69 x 35 | 79 x 39 ?
const mainDisplayWidth = 69
const mainDisplayHeight = 35

const messageDisplayWidth = 69
const messageDisplayHeight = 35
const messageBufferDisplaySize = 5

// const generateWidth = mainDisplayWidth
// const generateHeight = mainDisplayHeight
const generateWidth = 120
const generateHeight = 120

const setMainToMapSize = false

// '#111a0e'
const mainBackgroundColor = '#0000FF'
const messageColor = '#FFF'
const messageBackgroundColor = 'transparent'
const htmlBackgroundColor = '#000000'

const frameLimit = 0
const recallAll = false
const revealAll = localStorage.getItem('revealAll') === 'true'
const playerLight = false

const initialDomain = parseInt(localStorage.getItem('initialDomain') ?? '0')

// const autoStartVisualizer = false
// const visualizerAutoplay = true

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
  playerLight,
  initialDomain,
  // autoStartVisualizer,
  // visualizerAutoplay,
}

export { CONFIG }
