import { Variable } from '../Variables'

export const building = {
  house: {
    keys: [
      ['buildingEntry'],
      ['buildingWindow'],
      ['buildingRoofFront'],
      ['buildingRoof'],
      ['buildingChimney'],
      ['smoke'],
      ['grassPath'],
    ],
    map: [
      ['     ', '     '],
      [' 433 ', ' 5   '],
      [' 222 ', '     '],
      [' 101 ', '     '],
      [' 666 ', '     '],
      ['     ', '     '],
    ],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  weaponSign: {
    keys: ['signWeapon'],
    map: [['0']],
    constraints: {
      domain: ['adjacentBuilding'],
      cells: ['empty', 'walkable'],
    },
  },

  potionSign: {
    keys: ['signPotion'],
    map: [['0']],
    constraints: {
      domain: ['adjacentBuilding'],
      cells: ['empty', 'walkable'],
    },
  },

  innSign: {
    keys: ['signInn'],
    map: [['0']],
    constraints: {
      domain: ['adjacentBuilding'],
      cells: ['empty', 'walkable'],
    },
  },

  well: {
    keys: [['grassPath'], ['caveWell']],
    map: [['   '], ['000'], ['010'], ['000'], ['   ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  campParty: {
    keys: [['campfire'], ['archer'], ['horse'], ['rogue'], ['sorceress']],
    map: [['     '], [' 3   '], ['2 0 1'], ['   4 '], ['     ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },
} satisfies Record<string, Variable>
