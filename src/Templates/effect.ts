import { EntityTemplate } from '../Core'

export const effect = {
  auraWhite: {
    name: 'aura',
    tag: ['feature'],
    sprite: {
      base: ['auraWhite'],
    },
  },

  auraBlue: {
    name: 'aura',
    tag: ['feature'],
    sprite: {
      base: ['auraBlue'],
    },
  },

  auraRed: {
    name: 'aura',
    tag: ['feature'],
    sprite: {
      base: ['auraRed'],
    },
  },

  auraGreen: {
    name: 'aura',
    tag: ['feature'],
    sprite: {
      base: ['auraGreen'],
    },
  },
} satisfies Record<string, EntityTemplate>
