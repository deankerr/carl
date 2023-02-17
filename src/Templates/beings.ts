export const beings = {
  player: {
    name: 'player',
    tiles: ['warriorBlueE1', 'warriorBlueE2'],
    tilesAutoCycle: 750,
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: 16,
  },
  spiderRed: {
    label: 'spiderRed',
    name: 'giant spider',
    tiles: ['spiderRed1', 'spiderRed2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },
  spiderBlack: {
    label: 'spiderBlack',
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
