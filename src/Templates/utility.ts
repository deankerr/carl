import { EntityTemplate } from '../Core'

export const utility = {
  // themed - these should be replaced with themed versions by Overseer
  wall: {
    name: 'themed wall',
    tag: ['terrain'],
    sprite: {
      base: ['?'],
    },
    color: ['pink', 'transparent'],
  },

  floor: {
    name: 'themed floor',
    tag: ['terrain'],
    sprite: {
      base: ['?'],
    },
    color: ['pink', 'transparent'],
  },

  stairsUp: {
    name: 'themed stairs up',
    tag: ['feature'],
    sprite: {
      base: ['?'],
    },
    color: ['pink', 'transparent'],
  },

  stairsDown: {
    name: 'themed stairs down',
    tag: ['feature'],
    sprite: {
      base: ['?'],
    },
    color: ['pink', 'transparent'],
  },
} satisfies Record<string, EntityTemplate>
