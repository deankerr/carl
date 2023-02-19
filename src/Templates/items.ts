import { EntityKey } from '../Core'

export const items = {
  book: {
    name: 'ancient thesaurus',
    tag: ['feature', 'item'],
    sprite: {
      base: ['bookBrown'],
    },
  },

  skullBook: {
    name: 'scary book of goosebumps',
    tag: ['feature', 'item'],
    sprite: {
      base: ['bookBlack'],
    },
  },

  greenBook: {
    name: "book of microsoft encarta '95",
    tag: ['feature', 'item'],
    sprite: {
      base: ['bookGreen'],
    },
  },

  goldKey: {
    name: 'golden key',
    tag: ['feature', 'item'],
    sprite: {
      base: ['keyGold'],
    },
  },

  scroll: {
    name: 'list of good places to eat around here',
    tag: ['feature', 'item'],
    sprite: {
      base: ['scroll'],
    },
  },

  blueOrb: {
    name: 'orb of retrospection',
    tag: ['feature', 'item'],
    sprite: {
      base: ['orbBlue'],
    },
  },

  goldSkull: {
    name: 'handsome golden skull',
    tag: ['feature', 'item'],
    sprite: {
      base: ['skullGold'],
    },
  },

  meat: {
    name: 'succulent leg of roast pheasant',
    tag: ['feature', 'item'],
    sprite: {
      base: ['meat'],
    },
  },

  bluePotion: {
    name: 'potion of blue powerade',
    tag: ['feature', 'item'],
    sprite: {
      base: ['potionBlue'],
    },
  },

  redPotion: {
    name: 'potion of clotted blood',
    tag: ['feature', 'item'],
    sprite: {
      base: ['potionRed'],
    },
  },

  goldPotion: {
    name: 'potion of lemon delight',
    tag: ['feature', 'item'],
    sprite: {
      base: ['potionGold'],
    },
  },

  blackPotion: {
    name: 'potion of asphalt',
    tag: ['feature', 'item'],
    sprite: {
      base: ['potionBlack'],
    },
  },

  pinkGem: {
    name: 'pink gem',
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemPink'],
    },
  },

  redGem: {
    name: 'red gem',
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemRed'],
    },
  },

  blueGem: {
    name: 'blue gem',
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemBlue'],
    },
  },

  greenGem: {
    name: 'green gem',
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemGreen'],
    },
  },

  goldGem: {
    name: 'gold gem',
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemGold'],
    },
  },

  copperPile: {
    name: 'pile of copper',
    tag: ['feature', 'item'],
    sprite: {
      base: ['copperPile'],
    },
  },

  silverPile: {
    name: 'pile of silver',
    tag: ['feature', 'item'],
    sprite: {
      base: ['silverPile'],
    },
  },

  goldPile: {
    name: 'pile of gold',
    tag: ['feature', 'item'],
    sprite: {
      base: ['goldPile'],
    },
  },

  leatherHelm: {
    name: 'leather helm',
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherHelm'],
    },
  },

  leatherArmor: {
    name: 'leather armor',
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherArmor'],
    },
  },

  leatherGloves: {
    name: 'leather gloves',
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherGlove'],
    },
  },

  leatherLeggings: {
    name: 'leather chaps',
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherLeggings'],
    },
  },

  leatherBoots: {
    name: 'leather boots',
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherBoot'],
    },
  },
}

export const itemKeys = Object.keys(items) as EntityKey[]
