import { EntityKey } from '../Core'

export const items = {
  book: {
    name: 'ancient thesaurus',
    tiles: ['bookBrown'],
    tag: ['feature', 'item'],
  },

  skullBook: {
    name: 'scary book of goosebumps',
    tiles: ['bookBlack'],
    tag: ['feature', 'item'],
  },

  greenBook: {
    name: "book of microsoft encarta '95",
    tiles: ['bookGreen'],
    tag: ['feature', 'item'],
  },

  goldKey: {
    name: 'golden key',
    tiles: ['keyGold'],
    tag: ['feature', 'item'],
  },

  scroll: {
    name: 'list of good places to eat around here',
    tiles: ['scroll'],
    tag: ['feature', 'item'],
  },

  blueOrb: {
    name: 'orb of retrospection',
    tiles: ['orbBlue'],
    tag: ['feature', 'item'],
  },

  goldSkull: {
    name: 'handsome golden skull',
    tiles: ['skullGold'],
    tag: ['feature', 'item'],
  },

  meat: {
    name: 'succulent leg of roast pheasant',
    tiles: ['meat'],
    tag: ['feature', 'item'],
  },

  bluePotion: {
    name: 'potion of blue powerade',
    tiles: ['potionBlue'],
    tag: ['feature', 'item'],
  },

  redPotion: {
    name: 'potion of clotted blood',
    tiles: ['potionRed'],
    tag: ['feature', 'item'],
  },

  goldPotion: {
    name: 'potion of lemon delight',
    tiles: ['potionGold'],
    tag: ['feature', 'item'],
  },

  blackPotion: {
    name: 'potion of asphalt',
    tiles: ['potionBlack'],
    tag: ['feature', 'item'],
  },

  pinkGem: {
    name: 'pink gem',
    tiles: ['gemPink'],
    tag: ['feature', 'item'],
  },

  redGem: {
    name: 'red gem',
    tiles: ['gemRed'],
    tag: ['feature', 'item'],
  },

  blueGem: {
    name: 'blue gem',
    tiles: ['gemBlue'],
    tag: ['feature', 'item'],
  },

  greenGem: {
    name: 'green gem',
    tiles: ['gemGreen'],
    tag: ['feature', 'item'],
  },

  goldGem: {
    name: 'gold gem',
    tiles: ['gemGold'],
    tag: ['feature', 'item'],
  },

  copperPile: {
    name: 'pile of copper',
    tiles: ['copperPile'],
    tag: ['feature', 'item'],
  },

  silverPile: {
    name: 'pile of silver',
    tiles: ['silverPile'],
    tag: ['feature', 'item'],
  },

  goldPile: {
    name: 'pile of gold',
    tiles: ['goldPile'],
    tag: ['feature', 'item'],
  },

  leatherHelm: {
    name: 'leather helm',
    tiles: ['leatherHelm'],
    tag: ['feature', 'item'],
  },

  leatherArmor: {
    name: 'leather armor',
    tiles: ['leatherArmor'],
    tag: ['feature', 'item'],
  },

  leatherGloves: {
    name: 'leather gloves',
    tiles: ['leatherGlove'],
    tag: ['feature', 'item'],
  },

  leatherLeggings: {
    name: 'leather chaps',
    tiles: ['leatherLeggings'],
    tag: ['feature', 'item'],
  },

  leatherBoots: {
    name: 'leather boots',
    tiles: ['leatherBoot'],
    tag: ['feature', 'item'],
  },
}

export const itemKeys = Object.keys(items) as EntityKey[]
