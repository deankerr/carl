// ADOM display total: 80 x 25, game map: 80 x 20
const PROD = import.meta.env.PROD

const CONFIG = {
  appInitial: 'game',
  // seed: 1234,
  seed: null,
  mainDisplayWidth: 48,
  mainDisplayHeight: 30,
  messageDisplayWidth: 64,
  messageDisplayHeight: 4,
  levelWidth: 48,
  levelHeight: 38,
  // initialLevel: 'ruins1',
  // initialLevel: 'dungeon4',
  // initialLevel: 'bigRoom',
  initialLevel: 'outdoor',
  lightsOnInitial: PROD ? false : true,
  backgroundColor: '#131313',
  htmlBGColor: PROD ? '#131313' : '#131313',
}

export { CONFIG }
