import { EntityKey } from '../Core'

export const items = {
  book: {
    name: 'dusty old tome',
    tiles: ['bookBrown'],
    tag: ['feature', 'item'],
  },

  skullBook: {
    name: 'sinister old tome',
    tiles: ['bookBlack'],
    tag: ['feature', 'item'],
  },

  greenBook: {
    name: 'book about birdwatching',
    tiles: ['bookGreen'],
    tag: ['feature', 'item'],
  },

  goldKey: {
    name: 'golden key',
    tiles: ['keyGold'],
    tag: ['feature', 'item'],
  },

  scroll: {
    name: 'list of places to eat around here',
    tiles: ['scroll'],
    tag: ['feature', 'item'],
  },

  blueOrb: {
    name: 'orb of wanning monarchy',
    tiles: ['orbBlue'],
    tag: ['feature', 'item'],
  },

  goldSkull: {
    name: 'golden skull',
    tiles: ['skullGold'],
    tag: ['feature', 'item'],
  },

  meat: {
    name: 'succulent leg of roast pheasant',
    tiles: ['meat'],
    tag: ['feature', 'item'],
  },

  bluePotion: {
    name: 'potion of manta',
    tiles: ['potionBlue'],
    tag: ['feature', 'item'],
  },

  redPotion: {
    name: 'potion of clotted blood',
    tiles: ['potionRed'],
    tag: ['feature', 'item'],
  },

  goldPotion: {
    name: 'potion of lemon juice',
    tiles: ['potionGold'],
    tag: ['feature', 'item'],
  },

  blackPotion: {
    name: 'potion of solid lead',
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
}

export const itemKeys = Object.keys(items) as EntityKey[]
