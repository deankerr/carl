import { EntityKey } from '../Core'

export const items = {
  book: {
    name: 'ancient thesaurus',
    tiles: ['bookBrown'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['bookBrown'],
    },
  },

  skullBook: {
    name: 'scary book of goosebumps',
    tiles: ['bookBlack'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['bookBlack'],
    },
  },

  greenBook: {
    name: "book of microsoft encarta '95",
    tiles: ['bookGreen'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['bookGreen'],
    },
  },

  goldKey: {
    name: 'golden key',
    tiles: ['keyGold'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['keyGold'],
    },
  },

  scroll: {
    name: 'list of good places to eat around here',
    tiles: ['scroll'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['scroll'],
    },
  },

  blueOrb: {
    name: 'orb of retrospection',
    tiles: ['orbBlue'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['orbBlue'],
    },
  },

  goldSkull: {
    name: 'handsome golden skull',
    tiles: ['skullGold'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['skullGold'],
    },
  },

  meat: {
    name: 'succulent leg of roast pheasant',
    tiles: ['meat'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['meat'],
    },
  },

  bluePotion: {
    name: 'potion of blue powerade',
    tiles: ['potionBlue'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['potionBlue'],
    },
  },

  redPotion: {
    name: 'potion of clotted blood',
    tiles: ['potionRed'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['potionRed'],
    },
  },

  goldPotion: {
    name: 'potion of lemon delight',
    tiles: ['potionGold'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['potionGold'],
    },
  },

  blackPotion: {
    name: 'potion of asphalt',
    tiles: ['potionBlack'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['potionBlack'],
    },
  },

  pinkGem: {
    name: 'pink gem',
    tiles: ['gemPink'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemPink'],
    },
  },

  redGem: {
    name: 'red gem',
    tiles: ['gemRed'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemRed'],
    },
  },

  blueGem: {
    name: 'blue gem',
    tiles: ['gemBlue'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemBlue'],
    },
  },

  greenGem: {
    name: 'green gem',
    tiles: ['gemGreen'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemGreen'],
    },
  },

  goldGem: {
    name: 'gold gem',
    tiles: ['gemGold'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['gemGold'],
    },
  },

  copperPile: {
    name: 'pile of copper',
    tiles: ['copperPile'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['copperPile'],
    },
  },

  silverPile: {
    name: 'pile of silver',
    tiles: ['silverPile'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['silverPile'],
    },
  },

  goldPile: {
    name: 'pile of gold',
    tiles: ['goldPile'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['goldPile'],
    },
  },

  leatherHelm: {
    name: 'leather helm',
    tiles: ['leatherHelm'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherHelm'],
    },
  },

  leatherArmor: {
    name: 'leather armor',
    tiles: ['leatherArmor'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherArmor'],
    },
  },

  leatherGloves: {
    name: 'leather gloves',
    tiles: ['leatherGlove'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherGlove'],
    },
  },

  leatherLeggings: {
    name: 'leather chaps',
    tiles: ['leatherLeggings'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherLeggings'],
    },
  },

  leatherBoots: {
    name: 'leather boots',
    tiles: ['leatherBoot'],
    tag: ['feature', 'item'],
    sprite: {
      base: ['leatherBoot'],
    },
  },
}

export const itemKeys = Object.keys(items) as EntityKey[]
