import { EntityTemplate } from '../Core'

export const furniture = {
  bookshelf: {
    name: 'bookshelf',
    sprite: {
      base: ['bookshelf'],
    },
    tag: ['feature', 'blocksMovement'],
  },

  bookshelfEmpty: {
    name: 'bookshelf',
    sprite: {
      base: ['bookshelfEmpty'],
    },
    tag: ['feature', 'blocksMovement'],
  },

  bigDeskLeft: {
    name: 'chair',
    sprite: {
      base: ['chairTableLeft'],
    },
    tag: ['feature', 'blocksMovement'],
  },

  bigDeskMiddle: {
    name: 'desk',
    sprite: { base: ['woodenTableLargeMiddleDoc'] },
    tag: ['feature', 'blocksMovement'],
  },

  bigDeskRight: {
    name: 'chair',
    sprite: { base: ['chairTableRight'] },
    tag: ['feature', 'blocksMovement'],
  },
} satisfies Record<string, EntityTemplate>
