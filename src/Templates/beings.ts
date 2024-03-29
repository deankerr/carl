import { EntityTemplate } from '../Core'

export const beings = {
  // Friendly
  player: {
    name: 'player',
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: [8],
    sprite: {
      build: 'warrior',
      animate: ['cycle', 750],
    },
  },

  archer: {
    name: 'archer',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: ["You can't change the 2nd amendment."],
    sprite: {
      build: 'archer',
      animate: ['cycle', 750],
    },
  },

  sorceress: {
    name: 'sorceress',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: ['The flows of magic are whimsical today.'],
    sprite: {
      build: 'sorceress',
      animate: ['cycle', 750],
    },
  },

  guy: {
    name: 'guy',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: ['Why allo allo allo!'],
    sprite: {
      build: 'guy',
      animate: ['cycle', 750],
    },
  },

  girl: {
    name: 'girl',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: ['Welcome to me town travla!'],
    sprite: {
      build: 'girl',
      animate: ['cycle', 750],
    },
  },

  thief: {
    name: 'thief',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: ["I've got what you need."],
    sprite: {
      build: 'thief',
      animate: ['cycle', 750],
    },
  },

  rogue: {
    name: 'rogue',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: ['Party time.'],
    sprite: {
      build: 'rogue',
      animate: ['cycle', 750],
    },
  },

  dog: {
    name: 'lil pupper',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: ['Woff!'],
    sprite: {
      build: 'dog',
      animate: ['cycle', 750],
    },
  },

  catTan: {
    name: 'cat',
    tag: ['being', 'actor', 'blocksMovement', 'friendly'],
    bumpMessage: ['Mrow!'],
    sprite: {
      build: 'catTan',
      animate: ['cycle', 750],
    },
  },

  horse: {
    name: 'horsey',
    tag: ['being', 'blocksMovement', 'friendly'],
    bumpMessage: ['Hurumph!'],
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
    name: 'king goblino',
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
    name: 'eye of beseeinya',
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
} satisfies Record<string, EntityTemplate>
