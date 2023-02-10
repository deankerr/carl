export const beings = {
  player: {
    name: 'player',
    tiles: ['@'],
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
    label: 'scorpionBlack',
    name: 'giant scorpion',
    tiles: ['scorpionBlack1', 'scorpionBlack2'],
    tilesAutoCycle: 1000,
    tag: ['being', 'actor', 'blocksMovement'],
  },
} as const
