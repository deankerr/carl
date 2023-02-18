export const beings = {
  // Friendly
  player: {
    name: 'player',
    tiles: ['warriorBlueE1', 'warriorBlueE2'],
    tilesAutoCycle: 750,
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: 16,
  },

  archer: {
    name: 'archer',
    tiles: ['archerW1', 'archerW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Give me a target!',
  },

  sorceress: {
    name: 'sorceress',
    tiles: ['sorceressW1', 'sorceressW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'The flows of magic are whimsical today.',
  },

  guy: {
    name: 'guy',
    tiles: ['guyW1', 'guyW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'More work?',
  },

  girl: {
    name: 'girl',
    tiles: ['girlW1', 'girlW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Welcome to our town, Glen Waverley.',
  },

  thief: {
    name: 'thief',
    tiles: ['thiefE1', 'thiefE2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: "I've got what you need.",
  },

  catBrown: {
    name: 'cat',
    tiles: ['catBrownS1', 'catBrownS2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Meow!',
  },
  catTan: {
    name: 'cat',
    tiles: ['catTanS1', 'catTanS2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Mrow!',
  },

  horse: {
    name: 'horsey',
    tiles: ['horseS1', 'horseS2'],
    tag: ['being', 'blocksMovement', 'friendly'],
    tilesAutoCycle: 1000,
    bumpMessage: 'Hurumph!',
  },

  // Unfriendly

  goblinSword: {
    name: 'sword goblin',
    tiles: ['goblinSwordE1', 'goblinSwordE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  goblinShaman: {
    name: 'goblin shaman',
    tiles: ['goblinShamanE1', 'goblinShamanE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  goblinSpear: {
    name: 'spear shaman',
    tiles: ['goblinSpearE1', 'goblinSpearE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  bigGoblin: {
    name: 'goblino',
    tiles: ['bigGoblinE1', 'bigGoblinE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  spiderRed: {
    name: 'giant spider',
    tiles: ['spiderRed1', 'spiderRed2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },

  spiderBlack: {
    name: 'giant spider',
    tiles: ['spiderBlack1', 'spiderBlack2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },

  scorpionRed: {
    name: 'giant scorpion',
    tiles: ['scorpionRed1', 'scorpionRed2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },

  scorpionBlack: {
    name: 'giant scorpion',
    tiles: ['scorpionBlack1', 'scorpionBlack2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },
} as const
