import { EntityTemplate } from '../Core'

export const doors = {
  woodenDoor: {
    name: 'door',
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['woodenDoorClosed', 'woodenDoorOpen'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  woodenDoorVertical: {
    name: 'door',
    tag: [
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
      'renderLevelHigh',
    ],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['woodenDoorVerticalClosed', 'woodenDoorVerticalOpen'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  woodenDoorVerticalTop: {
    name: 'door',
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'isVertical'],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['woodenDoorVerticalClosedTop', 'woodenDoorVerticalOpenTop'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  stoneDoor: {
    name: 'door',
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'renderLevelHigh'],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['stoneDoorClosed', 'stoneDoorOpen'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  stoneDoorVertical: {
    name: 'door',
    tag: [
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
      'renderLevelHigh',
    ],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['stoneDoorVerticalClosed', 'stoneDoorVerticalOpen'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  stoneDoorVerticalTop: {
    name: 'door',
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'isVertical'],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['stoneDoorVerticalClosedTop', 'stoneDoorVerticalOpenTop'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  jailDoor: {
    name: 'door',
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['jailDoorClosed', 'jailDoorOpen'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  jailDoorVertical: {
    name: 'door',
    tag: [
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
      'renderLevelHigh',
    ],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['jailDoorVerticalClosed', 'jailDoorVerticalOpen'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  jailDoorVerticalTop: {
    name: 'door',
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'isVertical'],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['jailDoorVerticalClosedTop', 'jailDoorVerticalOpenTop'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  redDoor: {
    name: 'door',
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['redDoorClosed', 'redDoorOpen'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  redDoorVertical: {
    name: 'door',
    tag: [
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
      'renderLevelHigh',
    ],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['redDoorVerticalClosed', 'redDoorVerticalOpen'],
      trigger: ['isClosed', 'isOpen'],
    },
  },

  redDoorVerticalTop: {
    name: 'door',
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'isVertical'],
    trodOn: ['You carefully backflip through the door.'],
    sprite: {
      base: ['redDoorVerticalClosedTop', 'redDoorVerticalOpenTop'],
      trigger: ['isClosed', 'isOpen'],
    },
  },
} satisfies Record<string, EntityTemplate>
