export const beings = {
  // Friendly
  player: {
    name: 'player',
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: 16,
    sprite: {
      build: 'warrior',
      animate: ['cycle', 750],
    },
  },

  archer: {
    name: 'archer',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Give me a target!',
    sprite: {
      build: 'archer',
      animate: ['cycle', 750],
    },
  },

  sorceress: {
    name: 'sorceress',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'The flows of magic are whimsical today.',
    sprite: {
      build: 'sorceress',
      animate: ['cycle', 750],
    },
  },

  guy: {
    name: 'guy',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'More work?',
    sprite: {
      build: 'guy',
      animate: ['cycle', 750],
    },
  },

  girl: {
    name: 'girl',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Welcome to our town, Glen Waverley.',
    sprite: {
      build: 'girl',
      animate: ['cycle', 750],
    },
  },

  thief: {
    name: 'thief',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: "I've got what you need.",
    sprite: {
      build: 'thief',
      animate: ['cycle', 750],
    },
  },

  catBrown: {
    name: 'cat',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Meow!',
    sprite: {
      build: 'catBrown',
      animate: ['cycle', 750],
    },
  },
  catTan: {
    name: 'cat',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: 'Mrow!',
    sprite: {
      build: 'catTan',
      animate: ['cycle', 750],
    },
  },

  horse: {
    name: 'horsey',
    tag: ['being', 'blocksMovement', 'friendly'],
    bumpMessage: 'Hurumph!',
    sprite: {
      build: 'horse',
      animate: ['cycle', 750],
    },
  },

  // Unfriendly

  goblinSword: {
    name: 'sword goblin',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'goblinSword',
      animate: ['cycle', 750],
    },
  },

  goblinShaman: {
    name: 'goblin shaman',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'goblinShaman',
      animate: ['cycle', 750],
    },
  },

  goblinSpear: {
    name: 'spear shaman',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'goblinSpear',
      animate: ['cycle', 750],
    },
  },

  bigGoblin: {
    name: 'goblino',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'bigGoblin',
      animate: ['cycle', 750],
    },
  },

  skeleton: {
    name: 'skeleton',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'skeleton',
      animate: ['cycle', 750],
    },
  },

  skeletonWarrior: {
    name: 'skeleton warrior',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'skeletonWarrior',
      animate: ['cycle', 750],
    },
  },

  skeletonShaman: {
    name: 'skeleton shaman',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'skeletonShaman',
      animate: ['cycle', 750],
    },
  },

  skeletonKing: {
    name: 'king skellybones',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'skeletonKing',
      animate: ['cycle', 750],
    },
  },

  beholder: {
    name: 'beholder',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'beholder',
      animate: ['cycle', 750],
    },
  },

  spider: {
    name: 'spider',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'spider',
      animate: ['cycle', 750],
    },
  },

  rat: {
    name: 'giant rat',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'rat',
      animate: ['cycle', 750],
    },
  },

  bat: {
    name: 'bat',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'bat',
      animate: ['cycle', 750],
    },
  },

  gelCube: {
    name: 'gelatinous cube',
    tag: ['being', 'actor', 'blocksMovement', 'hostile'],
    sprite: {
      build: 'gelCube',
      animate: ['cycle', 750],
    },
  },
} as const
