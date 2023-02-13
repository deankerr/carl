export const features = {
  woodenDoor: {
    name: 'door',
    tiles: ['woodenDoorClosed', 'woodenDoorOpen'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },
  woodenDoorVertical: {
    name: 'door',
    tiles: ['woodenDoorVerticalClosed', 'woodenDoorVerticalOpen'],
    tag: [
      'memorable',
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
    ],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },
  woodenDoorVerticalTop: {
    name: 'door',
    tiles: ['woodenDoorVerticalClosedTop', 'woodenDoorVerticalOpenTop'],
    tag: [
      'memorable',
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
    ],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },
  stoneDoor: {
    name: 'door',
    tiles: ['stoneDoorClosed', 'stoneDoorOpen'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
    tileVariant: ['stoneDoorV', 'stoneDoorVNorth'],
  },
  stoneDoorVertical: {
    name: 'door',
    tiles: ['stoneDoorVerticalClosed', 'stoneDoorVerticalOpen'],
    tag: [
      'memorable',
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
    ],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },
  stoneDoorVerticalTop: {
    name: 'door',
    tiles: ['stoneDoorVerticalClosedTop', 'stoneDoorVerticalOpenTop'],
    tag: [
      'memorable',
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'isVertical',
    ],
    trodOn: 'You carefully backflip through the door.',
    tileTriggers: ['isClosed', 'isOpen'],
  },
  web: {
    name: 'web',
    tiles: ['web1'],
    tag: ['feature'],
  },
  webCorner: {
    name: 'web',
    tiles: ['webNW', 'webNE', 'webSW', 'webSE'],
    tag: ['feature', 'pickTileCorner'],
  },
  cactus: {
    name: 'cactus',
    tiles: ['cactus'],
    tag: ['feature'],
  },
  lilypad1: {
    name: 'lilypad',
    tiles: ['lilypad11', 'lilypad12'],
    tilesAutoCycle: 1000,
    tag: ['feature'],
    trodOn: 'You bounce off the lilypad.',
  },
  lilypad2: {
    name: 'lilypad',
    tiles: ['lilypad21', 'lilypad22'],
    tilesAutoCycle: 1000,
    tag: ['feature'],
    trodOn: 'You bounce off the lilypad.',
  },
  lilypad3: {
    name: 'lilypad',
    tiles: ['lilypad31', 'lilypad32'],
    tilesAutoCycle: 1000,
    tag: ['feature'],
    trodOn: 'You bounce off the lilypad.',
  },
  lilypad4: {
    name: 'lilypad',
    tiles: ['lilypad41', 'lilypad42'],
    tilesAutoCycle: 1000,
    tag: ['feature'],
    trodOn: 'You bounce off the lilypad.',
  },
  grassTuft: {
    name: 'tuft of grass',
    tiles: ['grassTuft1', 'grassTuft2', 'grassTuft3', 'grassTuft4', 'grassTuft5'],
    tag: ['feature', 'pickTileEqually'],
  },
  redMushrooms: {
    name: 'red mushrooms',
    tiles: ['redMushrooms'],
    tag: ['feature'],
  },
  purpleMushrooms: {
    name: 'purple mushrooms',
    tiles: ['purpleMushrooms'],
    tag: ['feature'],
  },
  yellowMushrooms: {
    name: 'yellow mushrooms',
    tiles: ['yellowMushrooms'],
    tag: ['feature'],
  },
  sconce: {
    name: 'sconce',
    tiles: ['sconce1', 'sconce2'],
    tilesAutoCycle: 120,
    tag: ['feature'],
  },
  candles: {
    name: 'candles',
    tiles: ['candles1', 'candles2'],
    tilesAutoCycle: 120,
    tag: ['feature'],
  },
  candlesNE: {
    name: 'candles',
    tiles: ['candlesNE1', 'candlesNE2'],
    tilesAutoCycle: 120,
    tag: ['feature'],
  },
  candlesSE: {
    name: 'candles',
    tiles: ['candlesSE1', 'candlesSE2'],
    tilesAutoCycle: 120,
    tag: ['feature'],
  },
  carpet: {
    name: 'carpet',
    tiles: ['carpet1', 'carpet2', 'carpet3'],
    tag: ['feature', 'pickTile'],
  },
  carpetEmblem1: {
    name: 'carpetEmblem1',
    tiles: ['carpetEmblem1'],
    tag: ['feature'],
  },
  carpetEmblem2: {
    name: 'carpet',
    tiles: ['carpetEmblem2'],
    tag: ['feature'],
  },
  statueWarrior: {
    name: 'warrior statue',
    tiles: ['statueWarrior'],
    tag: ['feature', 'blocksMovement'],
  },
  statueDragon: {
    name: 'warrior statue',
    tiles: ['statueDragon'],
    tag: ['feature', 'blocksMovement'],
  },
  statueMonster: {
    name: 'warrior statue',
    tiles: ['statueMonster'],
    tag: ['feature', 'blocksMovement'],
  },
} as const
