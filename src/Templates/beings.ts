export const beings = {
  player: {
    name: 'player',
    tiles: ['warriorBlueE1', 'warriorBlueE2'],
    tilesAutoCycle: 750,
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: 16,
  },
  archer: {
    name: 'archer',
    tiles: ['archerW1', 'archerW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  sorceress: {
    name: 'sorceress',
    tiles: ['sorceressW1', 'sorceressW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  guy: {
    name: 'guy',
    tiles: ['guyW1', 'guyW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  girl: {
    name: 'girl',
    tiles: ['girlW1', 'girlW2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  thief: {
    name: 'thief',
    tiles: ['thiefE1', 'thiefE2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  catBrown: {
    name: 'catBrown',
    tiles: ['catBrownS1', 'catBrownS2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  catTan: {
    name: 'catTan',
    tiles: ['catTanS1', 'catTanS2'],
    tilesAutoCycle: 750,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  spiderRed: {
    name: 'giant spider',
    tiles: ['spiderRed1', 'spiderRed2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  spiderBlack: {
    name: 'giant spider',
    tiles: ['spiderBlack1', 'spiderBlack2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  scorpionRed: {
    name: 'giant scorpion',
    tiles: ['scorpionRed1', 'scorpionRed2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  scorpionBlack: {
    name: 'giant scorpion',
    tiles: ['scorpionBlack1', 'scorpionBlack2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  horse: {
    name: 'horsey',
    tiles: ['horseS1', 'horseS2'],
    tag: ['being', 'blocksMovement'],
    tilesAutoCycle: 1000,
  },
} as const
