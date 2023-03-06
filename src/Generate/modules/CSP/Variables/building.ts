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
    ],
    map: [
      ['     ', '     '],
      [' 433 ', ' 5   '],
      [' 222 ', '     '],
      [' 101 ', '     '],
      ['     ', '     '],
      ['     ', '     '],
    ],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },
} satisfies Record<string, Variable>
