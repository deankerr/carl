// ADOM display total: 80 x 25, game map: 80 x 20
const PROD = import.meta.env.PROD

const CONFIG = {
  displayWidth: 80,
  displayHeight: 25,
  refreshRate: 50,
  marginTop: 2,
  marginBot: 2,
  levelWidth: 80,
  levelHeight: 20,
  // appInitial: PROD ? 'dungeon4' : 'game', // ! d4vis broken with TSDisplay
  appInitial: 'game',
  lightsOnInitial: PROD ? false : true,
  htmlBGColor: PROD ? '#000' : '#444',
  useTSDisplay: true,
  TSDisplayWidth: 48,
  TSDisplayHeight: 28,
  TSLevelWidth: 48,
  TSLevelHeight: 24,
  // oldMessageTurns: 10, // how old can messages be to still appear in the buffer
}

export { CONFIG }
