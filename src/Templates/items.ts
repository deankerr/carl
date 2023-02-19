import { EntityKey, EntityTemplate } from '../Core'

export const items = {
  book: {
    name: 'ancient thesaurus',
    tag: ['item'],
    sprite: {
      base: ['bookBrown'],
    },
  },

  skullBook: {
    name: 'scary book of goosebumps',
    tag: ['item'],
    sprite: {
      base: ['bookBlack'],
    },
  },

  greenBook: {
    name: "book of microsoft encarta '95",
    tag: ['item'],
    sprite: {
      base: ['bookGreen'],
    },
  },

  goldKey: {
    name: 'golden key',
    tag: ['item'],
    sprite: {
      base: ['keyGold'],
    },
  },

  scroll: {
    name: 'list of good places to eat around here',
    tag: ['item'],
    sprite: {
      base: ['scroll'],
    },
  },

  blueOrb: {
    name: 'orb of retrospection',
    tag: ['item'],
    sprite: {
      base: ['orbBlue'],
    },
  },

  goldSkull: {
    name: 'handsome golden skull',
    tag: ['item'],
    sprite: {
      base: ['skullGold'],
    },
  },

  meat: {
    name: 'succulent leg of roast pheasant',
    tag: ['item'],
    sprite: {
      base: ['meat'],
    },
  },

  bluePotion: {
    name: 'potion of blue powerade',
    tag: ['item'],
    sprite: {
      base: ['potionBlue'],
    },
  },

  redPotion: {
    name: 'potion of clotted blood',
    tag: ['item'],
    sprite: {
      base: ['potionRed'],
    },
  },

  goldPotion: {
    name: 'potion of lemon delight',
    tag: ['item'],
    sprite: {
      base: ['potionGold'],
    },
  },

  blackPotion: {
    name: 'potion of asphalt',
    tag: ['item'],
    sprite: {
      base: ['potionBlack'],
    },
  },

  pinkGem: {
    name: 'pink gem',
    tag: ['item'],
    sprite: {
      base: ['gemPink'],
    },
  },

  redGem: {
    name: 'red gem',
    tag: ['item'],
    sprite: {
      base: ['gemRed'],
    },
  },

  blueGem: {
    name: 'blue gem',
    tag: ['item'],
    sprite: {
      base: ['gemBlue'],
    },
  },

  greenGem: {
    name: 'green gem',
    tag: ['item'],
    sprite: {
      base: ['gemGreen'],
    },
  },

  goldGem: {
    name: 'gold gem',
    tag: ['item'],
    sprite: {
      base: ['gemGold'],
    },
  },

  copperPile: {
    name: 'pile of copper',
    tag: ['item'],
    sprite: {
      base: ['copperPile'],
    },
  },

  silverPile: {
    name: 'pile of silver',
    tag: ['item'],
    sprite: {
      base: ['silverPile'],
    },
  },

  goldPile: {
    name: 'pile of gold',
    tag: ['item'],
    sprite: {
      base: ['goldPile'],
    },
  },

  leatherHelm: {
    name: 'leather helm',
    tag: ['item'],
    sprite: {
      base: ['leatherHelm'],
    },
  },

  leatherArmor: {
    name: 'leather armor',
    tag: ['item'],
    sprite: {
      base: ['leatherArmor'],
    },
  },

  leatherGloves: {
    name: 'leather gloves',
    tag: ['item'],
    sprite: {
      base: ['leatherGlove'],
    },
  },

  leatherLeggings: {
    name: 'leather chaps',
    tag: ['item'],
    sprite: {
      base: ['leatherLeggings'],
    },
  },

  leatherBoots: {
    name: 'leather boots',
    tag: ['item'],
    sprite: {
      base: ['leatherBoot'],
    },
  },
} satisfies Record<string, EntityTemplate>

export const itemKeys = Object.keys(items) as EntityKey[]
