// ADOM display total: 80 x 25, game map: 80 x 20
const PROD = import.meta.env.PROD

const CONFIG = {
  appInitial: 'game',
  seed: 1234,
  // seed: null,
  mainDisplayWidth: 49,
  mainDisplayHeight: 27,
  messageDisplayWidth: 59,
  messageDisplayHeight: 6,
  levelWidth: 48,
  levelHeight: 38,
  lightsOnInitial: PROD ? false : false,
  backgroundColor: '#191919',
  messageColor: '#FFF',
  msgBgColor: ' rgb(20,80,40,1)',
  // msgBgColor: 'transparent', //' rgb(80,120,0,1)',
  htmlBGColor: PROD ? '#191919' : '#DD7766',
}

export { CONFIG }
