const PROD = import.meta.env.PROD

const appInitial = 'game'
// const seed = 1234
const seed = null

// 59 x 29 | 69 x 35 | 79 x 39 ?
const mainDisplayWidth = 69
const mainDisplayHeight = 35
const messageDisplayWidth = 60
const messageDisplayHeight = 4

const generateWidth = mainDisplayWidth
const generateHeight = mainDisplayHeight
// '#111a0e'
const mainBackgroundColor = '#000000'
const messageColor = '#FFF'
const messageBackgroundColor = 'transparent'
const htmlBackgroundColor = mainBackgroundColor

const frameLimit = 0
const lightsOnInitial = PROD ? false : true
const debugShowLightInfo = false

const autoStartVisualizer = false
const visualizerAutoplay = true

const CONFIG = {
  appInitial,
  seed,
  mainDisplayWidth,
  mainDisplayHeight,
  messageDisplayWidth,
  messageDisplayHeight,
  generateWidth,
  generateHeight,
  mainBackgroundColor,
  messageColor,
  messageBackgroundColor,
  htmlBackgroundColor,
  frameLimit,
  debugShowLightInfo,
  lightsOnInitial,
  autoStartVisualizer,
  visualizerAutoplay,
}

export { CONFIG }
