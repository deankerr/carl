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

  door: {
    name: 'themed door',
    tag: ['feature'],
    sprite: {
      base: ['?'],
    },
    color: ['pink', 'transparent'],
  },

  // fog
  fogLight: {
    name: 'fog of war',
    tag: ['feature', 'renderLevelHigh'],
    sprite: {
      base: ['fogLight'],
    },
  },

  fogMedium: {
    name: 'fog of war',
    tag: ['feature', 'renderLevelHigh'],
    sprite: {
      base: ['fogMedium'],
    },
  },

  fogHeavy: {
    name: 'fog of war',
    tag: ['feature', 'renderLevelHigh'],
    sprite: {
      base: ['fogHeavy'],
    },
  },

  fogRed: {
    name: 'fog of war',
    tag: ['feature', 'renderLevelHigh'],
    sprite: {
      base: ['fogRed'],
    },
  },

  fogGreen: {
    name: 'fog of war',
    tag: ['feature', 'renderLevelHigh'],
    sprite: {
      base: ['fogGreen'],
    },
  },

  debug: {
    name: 'debug',
    tag: ['feature', 'debug'],
    sprite: {
      base: ['*'],
    },
    color: ['transparent', 'transparent'],
  },
} satisfies Record<string, EntityTemplate>
