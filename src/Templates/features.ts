import { EntityTemplate } from '../Core'
import { doors } from './doors'
import { effect } from './effect'
import { furniture } from './furniture'
import { plant } from './plant'
import { stairs } from './stairs'

export const features = {
  ...furniture,
  ...stairs,
  ...doors,
  ...plant,
  ...effect,

  crate: {
    name: 'crate',
    sprite: { base: ['crate'] },
    tag: ['feature', 'blocksMovement'],
  },

  chest: {
    name: 'chest',
    sprite: { base: ['chest'] },
    tag: ['feature', 'blocksMovement'],
  },

  tombstone1: {
    name: 'tombstone1',
    sprite: { base: ['tombstone1'] },
    tag: ['feature', 'blocksMovement'],
  },

  tombstone2: {
    name: 'tombstone2',
    sprite: { base: ['tombstone2'] },
    tag: ['feature', 'blocksMovement'],
  },

  trap: {
    name: 'trap',
    sprite: { base: ['bearTrap'] },
    tag: ['feature'],
  },

  // Floor decoration
  web: {
    name: 'web',
    tag: ['feature'],
    sprite: {
      base: ['web1'],
    },
  },
  webNW: {
    name: 'web',
    tag: ['feature'],
    sprite: {
      base: ['webNW'],
    },
  },
  webNE: {
    name: 'web',
    tag: ['feature'],
    sprite: {
      base: ['webNE'],
    },
  },
  webSW: {
    name: 'web',
    tag: ['feature'],
    sprite: {
      base: ['webSW'],
    },
  },
  webSE: {
    name: 'web',
    tag: ['feature'],
    sprite: {
      base: ['webSE'],
    },
  },

  candles: {
    name: 'candles',
    tag: ['feature'],
    sprite: {
      base: ['candles1', 'candles2'],
      animate: ['cycle', 200],
    },
  },

  candlesNE: {
    name: 'candles',
    tag: ['feature'],
    sprite: {
      base: ['candlesNE1', 'candlesNE2'],
      animate: ['cycle', 200],
    },
  },

  candlesSE: {
    name: 'candles',
    tag: ['feature'],
    sprite: {
      base: ['candlesSE1', 'candlesSE2'],
      animate: ['cycle', 200],
    },
  },

  shrub: {
    name: 'shrub',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['shrub1', 'shrub2'],
      noise: [-1],
    },
  },

  campfire: {
    name: 'campfire',
    tag: ['feature'],
    trodOn: ['You feel a sense of urgency.'],
    sprite: {
      base: ['campfire1', 'campfire2'],
      animate: ['cycle', 350],
    },
  },

  signBlank: {
    name: 'sign',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['signBlank'],
    },
  },

  signWeapon: {
    name: 'sign',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['signWeapon'],
    },
  },

  signPotion: {
    name: 'sign',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['signPotion'],
    },
  },

  signInn: {
    name: 'sign',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['signInn'],
    },
  },

  dirtLedge: {
    name: 'dirtLedge',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['dirtLedge'],
    },
  },

  bones1: {
    name: 'bones',
    tag: ['feature'],
    trodOn: ['You trample some musty old bones.'],
    sprite: {
      base: ['bones1'],
    },
  },

  bones2: {
    name: 'bones',
    tag: ['feature'],
    trodOn: ['You trample some musty old bones.'],
    sprite: {
      base: ['bones2'],
    },
  },

  bones3: {
    name: 'bones',
    tag: ['feature'],
    trodOn: ['You trample some musty old bones.'],
    sprite: {
      base: ['bones3'],
    },
  },

  // Wall decoration
  sconce: {
    name: 'sconce',
    tag: ['feature'],
    sprite: {
      base: ['sconce1', 'sconce2'],
      animate: ['cycle', 400],
    },
    children: [['', '', 'sconceLower', '']],
  },

  sconceLower: {
    name: 'sconce',
    tag: ['feature', 'renderLevelLow'],
    sprite: {
      base: ['sconceLower2', 'sconceLower1'],
      animate: ['cycle', 400],
    },
  },

  stoneBoulder: {
    name: 'boulder',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['stoneBoulder'],
    },
  },

  dirtBoulder: {
    name: 'boulder',
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['dirtBoulder'],
    },
  },
} satisfies Record<string, EntityTemplate>
