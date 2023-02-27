import { EntityTemplate } from '../Core'

export const plant = {
  lilypad1: {
    name: 'lilypad',
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
    sprite: {
      base: ['lilypad11', 'lilypad12'],
      animate: ['cycle', 1000],
    },
  },

  lilypad2: {
    name: 'lilypad',
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
    sprite: {
      base: ['lilypad21', 'lilypad22'],
      animate: ['cycle', 1000],
    },
  },

  lilypad3: {
    name: 'lilypad',
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
    sprite: {
      base: ['lilypad31', 'lilypad32'],
      animate: ['cycle', 1000],
    },
  },

  lilypad4: {
    name: 'lilypad',
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
    sprite: {
      base: ['lilypad41', 'lilypad42'],
      animate: ['cycle', 1000],
    },
  },

  grassTuft: {
    name: 'tuft of grass',
    tag: ['feature'],
    sprite: {
      base: ['grassTuft1', 'grassTuft2', 'grassTuft3', 'grassTuft4', 'grassTuft5'],
    },
  },

  redMushrooms: {
    name: 'red mushrooms',
    tag: ['feature'],
    sprite: {
      base: ['redMushrooms'],
    },
  },

  purpleMushrooms: {
    name: 'purple mushrooms',
    tag: ['feature'],
    sprite: {
      base: ['purpleMushrooms'],
    },
  },

  yellowMushrooms: {
    name: 'yellow mushrooms',
    tag: ['feature'],
    sprite: {
      base: ['yellowMushrooms'],
    },
  },
} satisfies Record<string, EntityTemplate>
