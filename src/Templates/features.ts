export const features = {
  // Stairs
  dungeonStairsDown: {
    name: 'stairs',
    tiles: ['dungeonStairsDown'],
    tag: ['feature'],
    portal: ['here', 'down'],
    sprite: {
      base: ['dungeonStairsDown'],
    },
  },

  dungeonStairsUp: {
    name: 'stairs',
    tiles: ['dungeonStairsUp'],
    tag: ['feature'],
    portal: ['here', 'up'],
    sprite: {
      base: ['dungeonStairsUp'],
    },
  },

  caveStairsDown: {
    name: 'stairs',
    tiles: ['caveStairsDown'],
    tag: ['feature'],
    portal: ['here', 'down'],
    sprite: {
      base: ['caveStairsDown'],
    },
  },

  caveStairsUp: {
    name: 'stairs',
    tiles: ['caveStairsUp'],
    tag: ['feature'],
    portal: ['here', 'up'],
    sprite: {
      base: ['caveStairsUp'],
    },
  },

  cryptStairsDown: {
    name: 'stairs',
    tiles: ['cryptStairsDown'],
    tag: ['feature'],
    portal: ['here', 'down'],
    sprite: {
      base: ['cryptStairsDown'],
    },
  },

  cryptStairsUp: {
    name: 'stairs',
    tiles: ['cryptStairsUp'],
    tag: ['feature'],
    portal: ['here', 'up'],
    sprite: {
      base: ['cryptStairsUp'],
    },
  },

  cavernStairsDown: {
    name: 'stairs',
    tiles: ['cavernStairsDown'],
    tag: ['feature'],
    portal: ['here', 'down'],
    sprite: {
      base: ['cavernStairsDown'],
    },
  },

  cavernStairsUp: {
    name: 'stairs',
    tiles: ['cavernStairsUp'],
    tag: ['feature'],
    portal: ['here', 'up'],
    sprite: {
      base: ['cavernStairsUp'],
    },
  },

  // Doors
  woodenDoor: {
    name: 'door',
    tiles: ['woodenDoorClosed', 'woodenDoorOpen'],
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  woodenDoorVertical: {
    name: 'door',
    tiles: ['woodenDoorVerticalClosed', 'woodenDoorVerticalOpen'],
    tag: [
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
      'renderLevelHigh',
    ],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  woodenDoorVerticalTop: {
    name: 'door',
    tiles: ['woodenDoorVerticalClosedTop', 'woodenDoorVerticalOpenTop'],
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'isVertical'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  stoneDoor: {
    name: 'door',
    tiles: ['stoneDoorClosed', 'stoneDoorOpen'],
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'renderLevelHigh'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
    tileVariant: ['stoneDoorV', 'stoneDoorVNorth'],
  },

  stoneDoorVertical: {
    name: 'door',
    tiles: ['stoneDoorVerticalClosed', 'stoneDoorVerticalOpen'],
    tag: [
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
      'renderLevelHigh',
    ],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  stoneDoorVerticalTop: {
    name: 'door',
    tiles: ['stoneDoorVerticalClosedTop', 'stoneDoorVerticalOpenTop'],
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'isVertical'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  jailDoor: {
    name: 'door',
    tiles: ['jailDoorClosed', 'jailDoorOpen'],
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
    tileVariant: ['jailDoorV', 'jailDoorVNorth'],
  },

  jailDoorVertical: {
    name: 'door',
    tiles: ['jailDoorVerticalClosed', 'jailDoorVerticalOpen'],
    tag: [
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
      'renderLevelHigh',
    ],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  jailDoorVerticalTop: {
    name: 'door',
    tiles: ['jailDoorVerticalClosedTop', 'jailDoorVerticalOpenTop'],
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'isVertical'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  redDoor: {
    name: 'door',
    tiles: ['redDoorClosed', 'redDoorOpen'],
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
    tileVariant: ['redDoorV', 'redDoorVNorth'],
  },

  redDoorVertical: {
    name: 'door',
    tiles: ['redDoorVerticalClosed', 'redDoorVerticalOpen'],
    tag: [
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
      'renderLevelHigh',
    ],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  redDoorVerticalTop: {
    name: 'door',
    tiles: ['redDoorVerticalClosedTop', 'redDoorVerticalOpenTop'],
    tag: ['feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door', 'isVertical'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },

  // Floor decoration
  web: {
    name: 'web',
    tiles: ['web1'],
    tag: ['feature'],
    sprite: {
      base: ['web1'],
    },
  },
  webNW: {
    name: 'web',
    tiles: ['web1'],
    tag: ['feature'],
    sprite: {
      base: ['webNW'],
    },
  },
  webNE: {
    name: 'web',
    tiles: ['web1'],
    tag: ['feature'],
    sprite: {
      base: ['webNE'],
    },
  },
  webSW: {
    name: 'web',
    tiles: ['web1'],
    tag: ['feature'],
    sprite: {
      base: ['webSW'],
    },
  },
  webSE: {
    name: 'web',
    tiles: ['web1'],
    tag: ['feature'],
    sprite: {
      base: ['webSE'],
    },
  },

  cactus: {
    name: 'cactus',
    tiles: ['cactus'],
    tag: ['feature'],
    sprite: {
      base: ['cactus'],
    },
  },

  lilypad1: {
    name: 'lilypad',
    tiles: ['lilypad11', 'lilypad12'],
    tilesAutoCycle: 1000,
    tag: ['feature'],
    trodOn: 'You bounce off the lilypad.',
    sprite: {
      base: ['lilypad11', 'lilypad12'],
      animate: ['cycle', 1000],
    },
  },

  lilypad2: {
    name: 'lilypad',
    tiles: ['lilypad21', 'lilypad22'],
    tilesAutoCycle: 1000,
    tag: ['feature'],
    trodOn: 'You bounce off the lilypad.',
    sprite: {
      base: ['lilypad21', 'lilypad22'],
      animate: ['cycle', 1000],
    },
  },

  lilypad3: {
    name: 'lilypad',
    tiles: ['lilypad31', 'lilypad32'],
    tilesAutoCycle: 1000,
    tag: ['feature'],
    trodOn: 'You bounce off the lilypad.',
    sprite: {
      base: ['lilypad31', 'lilypad32'],
      animate: ['cycle', 1000],
    },
  },

  lilypad4: {
    name: 'lilypad',
    tiles: ['lilypad41', 'lilypad42'],
    tilesAutoCycle: 1000,
    tag: ['feature'],
    trodOn: 'You bounce off the lilypad.',
    sprite: {
      base: ['lilypad41', 'lilypad42'],
      animate: ['cycle', 1000],
    },
  },

  grassTuft: {
    name: 'tuft of grass',
    tiles: ['grassTuft1', 'grassTuft2', 'grassTuft3', 'grassTuft4', 'grassTuft5'],
    tag: ['feature', 'pickTileEqually'],
    sprite: {
      base: ['grassTuft1', 'grassTuft2', 'grassTuft3', 'grassTuft4', 'grassTuft5'],
    },
  },

  redMushrooms: {
    name: 'red mushrooms',
    tiles: ['redMushrooms'],
    tag: ['feature'],
    sprite: {
      base: ['redMushrooms'],
    },
  },

  purpleMushrooms: {
    name: 'purple mushrooms',
    tiles: ['purpleMushrooms'],
    tag: ['feature'],
    sprite: {
      base: ['purpleMushrooms'],
    },
  },

  yellowMushrooms: {
    name: 'yellow mushrooms',
    tiles: ['yellowMushrooms'],
    tag: ['feature'],
    sprite: {
      base: ['yellowMushrooms'],
    },
  },

  candles: {
    name: 'candles',
    tiles: ['candles1', 'candles2'],
    tilesAutoCycle: 200,
    tag: ['feature'],
    sprite: {
      base: ['candles1'],
      animate: ['cycle', 200],
    },
  },

  candlesNE: {
    name: 'candles',
    tiles: ['candlesNE1', 'candlesNE2'],
    tilesAutoCycle: 200,
    tag: ['feature'],
    sprite: {
      base: ['candlesNE1'],
      animate: ['cycle', 200],
    },
  },

  candlesSE: {
    name: 'candles',
    tiles: ['candlesSE1', 'candlesSE2'],
    tilesAutoCycle: 200,
    tag: ['feature'],
    sprite: {
      base: ['candlesSE1'],
      animate: ['cycle', 200],
    },
  },

  carpet: {
    name: 'carpet',
    tiles: ['carpet1', 'carpet2', 'carpet3'],
    tag: ['feature', 'pickTile'],
    sprite: {
      base: ['carpet1'],
    },
  },

  carpetEmblem1: {
    name: 'carpetEmblem1',
    tiles: ['carpetEmblem1'],
    tag: ['feature'],
    sprite: {
      base: ['carpetEmblem1'],
    },
  },

  carpetEmblem2: {
    name: 'carpet',
    tiles: ['carpetEmblem2'],
    tag: ['feature'],
    sprite: {
      base: ['carpetEmblem2'],
    },
  },

  shrub: {
    name: 'shrub',
    tiles: ['shrub1', 'shrub2'],
    tag: ['feature', 'pickTile'],
    sprite: {
      base: ['shrub1'],
    },
  },

  campfire: {
    name: 'campfire',
    tiles: ['C'],
    tag: ['feature'],
    trodOn: 'You feel a sense of urgency.',
    sprite: {
      base: ['campfire1', 'campfire2'],
      animate: ['cycle', 350],
    },
  },

  signBlank: {
    name: 'sign',
    tiles: ['signBlank'],
    tag: ['feature', 'memorable'],
    sprite: {
      base: ['signBlank'],
    },
  },

  signWeapon: {
    name: 'sign',
    tiles: ['signWeapon'],
    tag: ['feature', 'memorable'],
    sprite: {
      base: ['signWeapon'],
    },
  },

  signPotion: {
    name: 'sign',
    tiles: ['signPotion'],
    tag: ['feature', 'memorable'],
    sprite: {
      base: ['signPotion'],
    },
  },

  signInn: {
    name: 'sign',
    tiles: ['signInn'],
    tag: ['feature', 'memorable'],
    sprite: {
      base: ['signInn'],
    },
  },

  dirtLedge: {
    name: 'dirtLedge',
    tiles: ['dirtLedge'],
    tag: ['feature', 'memorable'],
    sprite: {
      base: ['dirtLedge'],
    },
  },

  bones: {
    name: 'bones',
    tiles: ['bones1', 'bones2', 'bones3'],
    tag: ['feature', 'pickTileEqually'],
    trodOn: 'You trample some musty old bones.',
    sprite: {
      base: ['bones1'],
    },
  },

  // Wall decoration
  sconce: {
    name: 'sconce',
    tiles: ['sconce1', 'sconce2'],
    tilesAutoCycle: 400,
    tag: ['feature'],
    sprite: {
      base: ['sconce1'],
      animate: ['cycle', 400],
    },
  },

  sconceLower: {
    name: 'sconce',
    tiles: ['sconceLower1', 'sconceLower2'],
    tilesAutoCycle: 400,
    tag: ['feature'],
    sprite: {
      base: ['sconceLower1'],
      animate: ['cycle', 400],
    },
  },

  // Solid decoration
  statueWarrior: {
    name: 'warrior statue',
    tiles: ['statueWarrior'],
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['statueWarrior'],
    },
  },

  statueDragon: {
    name: 'warrior statue',
    tiles: ['statueDragon'],
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['statueDragon'],
    },
  },

  statueMonster: {
    name: 'warrior statue',
    tiles: ['statueMonster'],
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['statueMonster'],
    },
  },

  stoneBoulder: {
    name: 'boulder',
    tiles: ['stoneBoulder'],
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['stoneBoulder'],
    },
  },

  dirtBoulder: {
    name: 'boulder',
    tiles: ['dirtBoulder'],
    tag: ['feature', 'blocksMovement'],
    sprite: {
      base: ['dirtBoulder'],
    },
  },

  bookshelf: {
    name: 'bookshelf',
    tiles: ['bookshelf'],
    sprite: {
      base: ['bookshelf'],
    },
    tag: ['feature', 'blocksMovement'],
  },

  // Utility
  shadow: {
    name: 'shadow',
    tiles: ['shadow'],
    tag: ['feature', 'memorable'],
    sprite: {
      base: ['shadow'],
    },
  },

  invisibleBlock: {
    name: 'invisible Block',
    tiles: ['stoneBoulder'],
    tag: ['feature', 'invisible', 'blocksMovement'],
    sprite: {
      base: ['stoneBoulder'],
    },
  },

  debug: {
    name: 'debug',
    tiles: ['0'],
    tag: ['feature', 'debug'],
    sprite: {
      base: ['0'],
    },
  },
} as const
