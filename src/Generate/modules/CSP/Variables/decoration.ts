import { Variable } from '../Variables'

export const decoration = {
  sconceTop: {
    keys: [['sconce']],
    map: [['0']],
    constraints: {
      domain: ['wall', 'top', 'exposed'],
      cells: ['empty'],
    },
  },

  sconceOpen: {
    keys: [['sconce']],
    map: [['0']],
    constraints: {
      domain: ['wall', 'exposed'],
      cells: ['empty'],
    },
  },

  cryptWallTomb: {
    keys: [['cryptWallTomb']],
    map: [['0']],
    constraints: {
      domain: ['wall', 'top', 'exposed'],
      cells: ['empty'],
    },
  },

  bones: {
    keys: [['bones1', 'bones2', 'bones3']],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

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
