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

  weaponShop: {
    keys: [
      ['buildingEntry'],
      ['buildingWindow'],
      ['buildingRoofFront'],
      ['buildingRoof'],
      ['buildingChimney'],
      ['smoke'],
      ['grassPath'],
      ['signWeapon'],
    ],
    map: [
      ['     ', '     '],
      [' 433 ', ' 5   '],
      [' 222 ', '     '],
      [' 1017', '     '],
      [' 666 ', '     '],
      ['     ', '     '],
    ],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  potionShop: {
    keys: [
      ['buildingEntry'],
      ['buildingWindow'],
      ['buildingRoofFront'],
      ['buildingRoof'],
      ['buildingChimney'],
      ['smoke'],
      ['grassPath'],
      ['signPotion'],
    ],
    map: [
      ['     ', '     '],
      [' 433 ', ' 5   '],
      [' 222 ', '     '],
      [' 1017', '     '],
      [' 666 ', '     '],
      ['     ', '     '],
    ],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  inn: {
    keys: [
      ['buildingEntry'],
      ['buildingWindow'],
      ['buildingRoofFront'],
      ['buildingRoof'],
      ['buildingChimney'],
      ['smoke'],
      ['grassPath'],
      ['signInn'],
    ],
    map: [
      ['     ', '     '],
      [' 433 ', ' 5   '],
      [' 222 ', '     '],
      [' 1017', '     '],
      [' 666 ', '     '],
      ['     ', '     '],
    ],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
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

  caveEntrance: {
    keys: [
      'dirtFloorOutdoorLedge',
      'dirtFloorOutdoor',
      'cryptStairsDown',
      'stoneBoulder',
      'dirtBoulder',
      ['bones1', 'bones2', 'bones3'],
    ],
    map: [
      ['       '],
      [' 00000 ', ' 4   3 '],
      [' 00200 ', ' 4   5 '],
      [' 00100 ', '    5  '],
      ['       '],
    ],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },
} satisfies Record<string, Variable>
