import { EntityTemplate } from '../Core'

export const features = {
  // Stairs
  dungeonStairsDown: {
    name: 'stairs',
    tag: ['feature'],
    portal: ['here', 'down'],
    sprite: {
      base: ['dungeonStairsDown'],
    },
  },

  dungeonStairsUp: {
    name: 'stairs',
    tag: ['feature'],
    portal: ['here', 'up'],
    sprite: {
      base: ['dungeonStairsUp'],
    },
  },

  caveStairsDown: {
    name: 'stairs',
    tag: ['feature'],
    portal: ['here', 'down'],
    sprite: {
      base: ['caveStairsDown'],
    },
  },

  caveStairsUp: {
    name: 'stairs',
    tag: ['feature'],
    portal: ['here', 'up'],
    sprite: {
      base: ['caveStairsUp'],
    },
  },

  cryptStairsDown: {
    name: 'stairs',
    tag: ['feature'],
    portal: ['here', 'down'],
    sprite: {
      base: ['cryptStairsDown'],
    },
  },

  cryptStairsUp: {
    name: 'stairs',
    tag: ['feature'],
    portal: ['here', 'up'],
    sprite: {
      base: ['cryptStairsUp'],
    },
  },

  cavernStairsDown: {
    name: 'stairs',
    tag: ['feature'],
    portal: ['here', 'down'],
    sprite: {
      base: ['cavernStairsDown'],
    },
  },

  cavernStairsUp: {
    name: 'stairs',
    tag: ['feature'],
    portal: ['here', 'up'],
    sprite: {
      base: ['cavernStairsUp'],
    },
  },

  // Doors
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

  cactus: {
    name: 'cactus',
    tag: ['feature'],
    sprite: {
      base: ['cactus'],
    },
  },

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

  shrub: {
    name: 'shrub',
    tag: ['feature'],
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
    tag: ['feature'],
    sprite: {
      base: ['signBlank'],
    },
  },

  signWeapon: {
    name: 'sign',
    tag: ['feature'],
    sprite: {
      base: ['signWeapon'],
    },
  },

  signPotion: {
    name: 'sign',
    tag: ['feature'],
    sprite: {
      base: ['signPotion'],
    },
  },

  signInn: {
    name: 'sign',
    tag: ['feature'],
    sprite: {
      base: ['signInn'],
    },
  },

  dirtLedge: {
    name: 'dirtLedge',
    tag: ['feature'],
    sprite: {
      base: ['dirtLedge'],
    },
  },

  bones: {
    name: 'bones',
    tag: ['feature'],
    trodOn: ['You trample some musty old bones.'],
    sprite: {
      base: ['bones1'],
    },
  },

  // Wall decoration
  sconce: {
    name: 'sconce',
    tag: ['feature'],
    sprite: {
      base: ['sconce1'],
      animate: ['cycle', 400],
    },
  },

  sconceLower: {
    name: 'sconce',
    tag: ['feature'],
    sprite: {
      base: ['sconceLower1'],
      animate: ['cycle', 400],
    },
  },

  // Solid decoration
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

  bookshelf: {
    name: 'bookshelf',
    sprite: {
      base: ['bookshelf'],
    },
    tag: ['feature', 'blocksMovement'],
  },

  // Utility
  shadow: {
    name: 'shadow',
    tag: ['feature', 'renderLevelHigh'],
    sprite: {
      base: ['lightShadow'],
    },
  },

  recalled: {
    name: 'recalled',
    tag: ['feature', 'renderLevelHigh'],
    sprite: {
      base: ['recalled'],
    },
  },

  invisibleBlock: {
    name: 'invisible Block',
    tag: ['feature', 'invisible', 'blocksMovement'],
    sprite: {
      base: ['stoneBoulder'],
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
