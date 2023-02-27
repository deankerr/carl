import { EntityTemplate } from '../Core'

export const stairs = {
  dungeonStairsDown: {
    name: 'stairs',
    tag: ['feature', 'stairs', 'down'],
    portal: ['here', 'down'],
    sprite: {
      base: ['dungeonStairsDown'],
    },
  },

  dungeonStairsUp: {
    name: 'stairs',
    tag: ['feature', 'stairs', 'up'],
    portal: ['here', 'up'],
    sprite: {
      base: ['dungeonStairsUp'],
    },
  },

  caveStairsDown: {
    name: 'stairs',
    tag: ['feature', 'stairs', 'down'],
    portal: ['here', 'down'],
    sprite: {
      base: ['caveStairsDown'],
    },
  },

  caveStairsUp: {
    name: 'stairs',
    tag: ['feature', 'stairs', 'up'],
    portal: ['here', 'up'],
    sprite: {
      base: ['caveStairsUp'],
    },
  },

  cryptStairsDown: {
    name: 'stairs',
    tag: ['feature', 'stairs', 'down'],
    portal: ['here', 'down'],
    sprite: {
      base: ['cryptStairsDown'],
    },
  },

  cryptStairsUp: {
    name: 'stairs',
    tag: ['feature', 'stairs', 'up'],
    portal: ['here', 'up'],
    sprite: {
      base: ['cryptStairsUp'],
    },
  },

  cavernStairsDown: {
    name: 'stairs',
    tag: ['feature', 'stairs', 'down'],
    portal: ['here', 'down'],
    sprite: {
      base: ['cavernStairsDown'],
    },
  },

  cavernStairsUp: {
    name: 'stairs',
    tag: ['feature', 'stairs', 'up'],
    portal: ['here', 'up'],
    sprite: {
      base: ['cavernStairsUp'],
    },
  },
} satisfies Record<string, EntityTemplate>
