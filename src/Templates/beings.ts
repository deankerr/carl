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
    sprite: {
      build: 'archer',
      animate: ['cycle', 750],
    },
  },

  sorceress: {
    name: 'sorceress',
    tiles: ['sorceressW1', 'sorceressW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'The flows of magic are whimsical today.',
    sprite: {
      build: 'sorceress',
      animate: ['cycle', 750],
    },
  },

  guy: {
    name: 'guy',
    tiles: ['guyW1', 'guyW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'More work?',
    sprite: {
      build: 'guy',
      animate: ['cycle', 750],
    },
  },

  girl: {
    name: 'girl',
    tiles: ['girlW1', 'girlW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Welcome to our town, Glen Waverley.',
    sprite: {
      build: 'girl',
      animate: ['cycle', 750],
    },
  },

  thief: {
    name: 'thief',
    tiles: ['thiefE1', 'thiefE2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: "I've got what you need.",
    sprite: {
      build: 'thief',
      animate: ['cycle', 750],
    },
  },

  catBrown: {
    name: 'cat',
    tiles: ['catBrownS1', 'catBrownS2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Meow!',
    sprite: {
      build: 'catBrown',
      animate: ['cycle', 750],
    },
  },
  catTan: {
    name: 'cat',
    tiles: ['catTanS1', 'catTanS2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Mrow!',
    sprite: {
      build: 'catTan',
      animate: ['cycle', 750],
    },
  },

  horse: {
    name: 'horsey',
    tiles: ['horseS1', 'horseS2'],
    tag: ['being', 'blocksMovement', 'friendly'],
    tilesAutoCycle: 1000,
    bumpMessage: 'Hurumph!',
    sprite: {
      build: 'horse',
      animate: ['cycle', 750],
    },
  },

  // Unfriendly

  goblinSword: {
    name: 'sword goblin',
    tiles: ['goblinSwordE1', 'goblinSwordE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'goblinSword',
      animate: ['cycle', 750],
    },
  },

  goblinShaman: {
    name: 'goblin shaman',
    tiles: ['goblinShamanE1', 'goblinShamanE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'goblinShaman',
      animate: ['cycle', 750],
    },
  },

  goblinSpear: {
    name: 'spear shaman',
    tiles: ['goblinSpearE1', 'goblinSpearE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'goblinSpear',
      animate: ['cycle', 750],
    },
  },

  bigGoblin: {
    name: 'goblino',
    tiles: ['bigGoblinE1', 'bigGoblinE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'bigGoblin',
      animate: ['cycle', 750],
    },
  },

  skeleton: {
    name: 'skeleton',
    tiles: ['skeletonE1', 'skeletonE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'skeleton',
      animate: ['cycle', 750],
    },
  },

  skeletonWarrior: {
    name: 'skeleton warrior',
    tiles: ['skeletonWarriorE1', 'skeletonWarriorE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'skeletonWarrior',
      animate: ['cycle', 750],
    },
  },

  skeletonShaman: {
    name: 'skeleton shaman',
    tiles: ['skeletonShamanE1', 'skeletonShamanE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'skeletonShaman',
      animate: ['cycle', 750],
    },
  },

  skeletonKing: {
    name: 'king skellybones',
    tiles: ['skeletonKingE1', 'skeletonKingE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'skeletonKing',
      animate: ['cycle', 750],
    },
  },

  beholder: {
    name: 'beholder',
    tiles: ['beholderE1', 'beholderE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'beholder',
      animate: ['cycle', 750],
    },
  },

  spider: {
    name: 'spider',
    tiles: ['spiderE1', 'spiderE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'spider',
      animate: ['cycle', 750],
    },
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
    sprite: {
      build: 'bat',
      animate: ['cycle', 750],
    },
  },

  gelCube: {
    name: 'gelatinous cube',
    tiles: ['gelCubeE1', 'gelCubeE2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'gelCube',
      animate: ['cycle', 750],
    },
  },

  // alt tileset

  // spiderRed: {
  //   name: 'giant spider',
  //   tiles: ['spiderRed1', 'spiderRed2'],
  //   tilesAutoCycle: 1000,
  //   tag: ['being', 'actor', 'blocksMovement'],
  // },

  // spiderBlack: {
  //   name: 'giant spider',
  //   tiles: ['spiderBlack1', 'spiderBlack2'],
  //   tilesAutoCycle: 1000,
  //   tag: ['being', 'actor', 'blocksMovement'],
  // },

  // scorpionRed: {
  //   name: 'giant scorpion',
  //   tiles: ['scorpionRed1', 'scorpionRed2'],
  //   tilesAutoCycle: 1000,
  //   tag: ['being', 'actor', 'blocksMovement'],
  // },

  // scorpionBlack: {
  //   name: 'giant scorpion',
  //   tiles: ['scorpionBlack1', 'scorpionBlack2'],
  //   tilesAutoCycle: 1000,
  //   tag: ['being', 'actor', 'blocksMovement'],
  // },
} as const
