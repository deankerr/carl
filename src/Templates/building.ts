import { EntityTemplate } from '../Core'

export const building = {
  buildingWindow: {
    name: 'building',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['buildingWindow1', 'buildingWindow2'],
      noise: [0],
    },
  },

  buildingEntry: {
    name: 'building',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['buildingDoor'],
    },
  },

  buildingRoofFront: {
    name: 'building',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['buildingRoofFront1', 'buildingRoofFront2'],
      noise: [0],
    },
  },

  buildingRoof: {
    name: 'building',
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
    sprite: {
      base: ['buildingRoof1', 'buildingRoofFront2'],
    },
  },

  buildingChimney: {
    name: 'building',
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
    sprite: {
      base: ['buildingChimneyL'],
    },
  },

  smoke: {
    name: 'chimney smoke',
    tag: ['feature'],
    sprite: {
      base: ['smoke1', 'smoke2'],
      animate: ['cycle', 500],
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
} satisfies Record<string, EntityTemplate>
