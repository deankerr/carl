import { Variable } from '../Variables'

export const decoration = {
  cornerCandle: {
    keys: [['candles', 'candlesNE', 'candlesSE']],
    map: [['0']],
    constraints: {
      domain: ['corner', 'walkable'],
      cells: ['empty'],
    },
  },

  cornerWebNorthWest: {
    keys: ['webNW'],
    map: [['0']],
    constraints: {
      domain: ['cornerNorthWest', 'walkable'],
      cells: ['empty'],
    },
  },

  cornerWebNorthEast: {
    keys: [['webNE']],
    map: [['0']],
    constraints: {
      domain: ['cornerNorthEast', 'walkable'],
      cells: ['empty'],
    },
  },

  cornerWebSouthEast: {
    keys: [['webSE']],
    map: [['0']],
    constraints: {
      domain: ['cornerSouthEast', 'walkable'],
      cells: ['empty'],
    },
  },

  cornerWebSouthWest: {
    keys: [['webSW']],
    map: [['0']],
    constraints: {
      domain: ['cornerSouthWest', 'walkable'],
      cells: ['empty'],
    },
  },
} satisfies Record<string, Variable>
