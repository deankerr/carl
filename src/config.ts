// ADOM display total: 80 x 25, game map: 80 x 20
const PROD = import.meta.env.PROD

const CONFIG = {
  appInitial: 'game',
  seed: 5234,
  displayW: 48,
  displayH: 30,
  topPanelSize: 4,
  botPanelSize: 4,
  levelWidthTileset: 48,
  levelHeightTileset: 38,
  useTileset: true,

  levelWidthText: 80,
  levelHeightText: 20,
  // levelWidthTileset: 48,
  // levelHeightTileset: 24,

  initialLevel: 'bigRoom',
  // initialLevel: 'dungeon4',
  lightsOnInitial: PROD ? false : false,
  htmlBGColor: PROD ? '#000' : '#000',
  displayWidthText: 80,
  displayHeightText: 25,
}

export { CONFIG }

// appInitial: PROD ? 'dungeon4' : 'game', // ! d4vis broken with TSDisplay
// oldMessageTurns: 10, // how old can messages be to still appear in the buffer
