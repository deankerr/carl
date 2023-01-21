export type FeatureTemplate = typeof Features[keyof typeof Features]

export const Features = {
  door: {
    id: 'door',
    name: 'door',
    char: 'doorClosed',
    color: '#73513d',
    tag: ['door', 'blocksLight', 'memorable'],
  },
  shrub: {
    id: 'shrub',
    name: 'shrub',
    char: 'shrub',
    color: '#58a54a',
    tag: ['walkable', 'memorable'],
    trodOn: 'You trample the pathetic shrub.',
  },
  flames: {
    id: 'flames',
    name: 'flames',
    char: 'flames1',
    color: '#fc7703',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: {
      list: ['flames1', 'flames2'],
      frequency: 120,
    },
    emitLight: {
      color: '#663000',
      flicker: 120,
    },
  },
  blueFlames: {
    id: 'blueflames',
    name: 'blue flames',
    char: 'flames1',
    color: '#141cff',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: {
      list: ['flames1', 'flames2'],
      frequency: 120,
    },
    emitLight: {
      color: '#000366',
      flicker: 120,
    },
  },
  greenFlames: {
    id: 'greenflames',
    name: 'green flames',
    char: 'flames1',
    color: '#00FF00',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: {
      list: ['flames1', 'flames2'],
      frequency: 120,
    },
    emitLight: {
      color: '#006600',
      flicker: 120,
    },
  },
}
