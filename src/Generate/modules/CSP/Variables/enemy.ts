import { Variable } from '../Variables'

export const enemy = {
  goblinPackWeak: {
    keys: ['goblinSword', 'goblinSpear'],
    map: [['01'], ['10']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  goblinPackStrong: {
    keys: ['goblinSword', 'goblinSpear', 'goblinShaman', 'bigGoblin'],
    map: [['01'], ['23']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  skeletonPackWeak: {
    keys: ['skeleton', 'skeletonWarrior'],
    map: [['01'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  skeletonPackStrong: {
    keys: ['skeleton', 'skeletonWarrior'],
    map: [['01'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  spiderPack: {
    keys: ['spider'],
    map: [['00'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  ratPack: {
    keys: ['rat'],
    map: [['00'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  batPack: {
    keys: ['bat'],
    map: [['00'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  gelCube: {
    keys: ['gelCube'],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  beholder: {
    keys: ['beholder'],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },
} satisfies Record<string, Variable>
