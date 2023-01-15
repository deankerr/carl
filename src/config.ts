// ADOM display total: 80 x 25, game map: 80 x 20
const PROD = import.meta.env.PROD

const CONFIG = {
  appInitial: 'game',
  // seed: 1234,
  seed: null,
  mainDisplayWidth: 56,
  mainDisplayHeight: 31,
  messageDisplayWidth: 84,
  messageDisplayHeight: 4,
  levelWidth: 48,
  levelHeight: 38,
  // initialLevel: 'ruins1',
  // initialLevel: 'dungeon4',
  // initialLevel: 'bigRoom',
  initialLevel: 'outdoor',
  // initialLevel: 'arena',
  lightsOnInitial: PROD ? false : true,
  backgroundColor: '#191919',
  // htmlBGColor: PROD ? '#191919' : 'pink',
  htmlBGColor: PROD ? '#191919' : '#191919',
}

export { CONFIG }
