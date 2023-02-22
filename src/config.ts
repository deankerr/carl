// const PROD = import.meta.env.PROD

const htmlBackgroundColor = '#000000'
const appInitial = 'game'

// const seed = 2225
const seed = null

const mainDisplayWidth = 37
const mainDisplayHeight = 19

const messageDisplayWidth = 55
const messageDisplayHeight = 28
const messageBufferDisplaySize = 5

const textDisplayWidth = 73
const textDisplayHeight = 32

const generateWidth = 37
const generateHeight = 19

const setMainToMapSize = true

const frameLimit = 0
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
  textDisplayWidth,
  textDisplayHeight,
  generateWidth,
  generateHeight,
  setMainToMapSize,
  htmlBackgroundColor,
  frameLimit,
  recallAll,
  revealAll,
  initialZone,
  autoStartVisualizer,
}

export { CONFIG }
