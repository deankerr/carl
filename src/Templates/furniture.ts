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

  carpet: {
    name: 'carpet',
    tag: ['feature'],
    sprite: {
      base: ['carpet1'],
    },
  },

  carpetEmblem1: {
    name: 'carpetEmblem1',
    tag: ['feature'],
    sprite: {
      base: ['carpetEmblem1'],
    },
  },

  carpetEmblem2: {
    name: 'carpet',
    tag: ['feature'],
    sprite: {
      base: ['carpetEmblem2'],
    },
  },

  statueWarrior: {
    name: 'warrior statue',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['statueWarrior'],
    },
  },

  statueDragon: {
    name: 'warrior statue',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['statueDragon'],
    },
  },

  statueMonster: {
    name: 'warrior statue',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['statueMonster'],
    },
  },

  pots1: {
    name: 'pots',
    sprite: { base: ['pots1'] },
    tag: ['feature', 'blocksMovement'],
  },

  pots2: {
    name: 'pots',
    sprite: { base: ['pots2'] },
    tag: ['feature', 'blocksMovement'],
  },

  pot: {
    name: 'pot',
    sprite: { base: ['pot'] },
    tag: ['feature', 'blocksMovement'],
  },

  cauldron: {
    name: 'cauldron',
    sprite: { base: ['cauldron1', 'cauldron2'], animate: ['cycle', 400] },
    tag: ['feature', 'blocksMovement'],
  },

  throneRed: {
    name: 'throne',
    sprite: { base: ['throneRed'] },
    tag: ['feature', 'blocksMovement'],
  },

  throne: {
    name: 'throne',
    sprite: { base: ['thronePurple'] },
    tag: ['feature', 'blocksMovement'],
  },
} satisfies Record<string, EntityTemplate>
