import { Variable } from '../Variables'

export const furniture = {
  bookshelf: {
    keys: ['bookshelf'],
    map: [['0'], [' ']],
    constraints: {
      domain: ['walkable', 'hasWallNorth'],
      cells: ['empty'],
    },
  },

  bookshelfEmpty: {
    keys: ['bookshelfEmpty'],
    map: [['0'], [' ']],
    constraints: {
      domain: ['walkable', 'hasWallNorth'],
      cells: ['empty'],
    },
  },

  bigDesk: {
    keys: ['bigDeskLeft', 'bigDeskMiddle', 'bigDeskRight'],
    map: [['     '], [' 012 '], ['     ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'walkable'],
    },
  },

  statue: {
    keys: [['statueDragon', 'statueMonster', 'statueWarrior']],
    map: [['   '], [' 0 '], ['   ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  pots: {
    keys: [['pot', 'pots1', 'pots2']],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  trap: {
    keys: ['trap'],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },
} satisfies Record<string, Variable>
