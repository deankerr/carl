// const PROD = import.meta.env.PROD

const appInitial = 'game'
// const seed = 1235
const seed = null

const mainDisplayWidth = 39
const mainDisplayHeight = 19

const messageDisplayWidth = 69
const messageDisplayHeight = 35
const messageBufferDisplaySize = 5

const generateWidth = 39 // approx 1.5 times graphical display size
const generateHeight = 19

const setMainToMapSize = true

// '#111a0e'
const mainBackgroundColor = '#000000'
const messageColor = '#FFF'
const messageBackgroundColor = 'transparent'
const htmlBackgroundColor = '#000000'

const frameLimit = 0
const lightFlickerFreq = 120
const recallAll = false
const revealAll = localStorage.getItem('revealAll') === 'true'

const initialZone = parseInt(localStorage.getItem('initialZone') ?? '0')

const autoStartVisualizer = false

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
  lightFlickerFreq,
  recallAll,
  revealAll,
  initialZone,
  autoStartVisualizer,
}

export { CONFIG }
