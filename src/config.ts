const PROD = import.meta.env.PROD

const appInitial = 'game'
const seed = null

const mainDisplayWidth = 59
const mainDisplayHeight = 29
const messageDisplayWidth = 60
const messageDisplayHeight = 4

const generateWidth = mainDisplayWidth
const generateHeight = mainDisplayHeight
// '#111a0e'
const mainBackgroundColor = '#111a0e'
const messageColor = '#FFF'
const messageBackgroundColor = 'transparent'
const htmlBackgroundColor = mainBackgroundColor

const frameLimit = 500
const lightsOnInitial = PROD ? false : true
const debugShowLightInfo = false

const autoVisualizer = true
const visualizerLast = false

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
  autoVisualizer,
  visualizerLast,
}

export { CONFIG }
