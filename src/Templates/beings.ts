export const beings = {
  // Friendly
  player: {
    name: 'player',
    tiles: ['E'],
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: 16,
    sprite: {
      build: 'warrior',
      animate: ['cycle', 750],
    },
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

  skeleton: {
    name: 'skeleton',
    tiles: ['skeletonE1', 'skeletonE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  skeletonWarrior: {
    name: 'skeleton warrior',
    tiles: ['skeletonWarriorE1', 'skeletonWarriorE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  skeletonShaman: {
    name: 'skeleton shaman',
    tiles: ['skeletonShamanE1', 'skeletonShamanE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  skeletonKing: {
    name: 'king skellybones',
    tiles: ['skeletonKingE1', 'skeletonKingE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  beholder: {
    name: 'beholder',
    tiles: ['beholderE1', 'beholderE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  spider: {
    name: 'spider',
    tiles: ['spiderE1', 'spiderE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  rat: {
    name: 'giant rat',
    tiles: ['ratE1', 'ratE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'rat',
      animate: ['cycle', 750],
    },
  },

  bat: {
    name: 'bat',
    tiles: ['batE1', 'batE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  gelCube: {
    name: 'gelatinous cube',
    tiles: ['gelCubeE1', 'gelCubeE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
  },

  // alt tileset

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
