// ADOM display total: 80 x 25, game map: 80 x 20
const PROD = import.meta.env.PROD

const CONFIG = {
  appInitial: 'game',
  // seed: 1234,
  seed: null,
  displayWidth: 48,
  displayHeight: 30,
  topPanelSize: 4,
  botPanelSize: 1,
  levelWidth: 48,
  levelHeight: 38,
  // initialLevel: 'ruins1',
  // initialLevel: 'dungeon4',
  // initialLevel: 'bigRoom',
  initialLevel: 'outdoor',
  lightsOnInitial: PROD ? false : true,
  htmlBGColor: PROD ? '#131313' : '#131313',
  displayWidthText: 80,
  displayHeightText: 25,
}

export { CONFIG }
