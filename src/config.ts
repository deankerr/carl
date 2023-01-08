// ADOM display total: 80 x 25, game map: 80 x 20
const PROD = import.meta.env.PROD

const CONFIG = {
  appInitial: 'game',
  seed: 1673152889440,
  renderLevelY1: 2,
  renderLevelY2: 2,
  displayWidthText: 80,
  displayHeightText: 25,
  displayWidthTileset: 48,
  displayHeightTileset: 28,

  levelWidthText: 80,
  levelHeightText: 20,
  levelWidthTileset: 48,
  levelHeightTileset: 24,
  useTileset: true,
  initialLevel: 'ruins1',
  // initialLevel: 'dungeon4',
  lightsOnInitial: PROD ? false : true,
  htmlBGColor: PROD ? '#000' : '#111',
}

export { CONFIG }

// appInitial: PROD ? 'dungeon4' : 'game', // ! d4vis broken with TSDisplay
// oldMessageTurns: 10, // how old can messages be to still appear in the buffer
// marginBot: 2,
