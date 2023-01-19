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
    cycleGraphic: ['flames1', 'flames2'],
    emitLight: true,
  },
  blueFlames: {
    id: 'blueflames',
    name: 'blue flames',
    char: 'flames1',
    color: '#141cff',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: ['flames1', 'flames2'],
    emitLight: true,
  },
  greenFlames: {
    id: 'greenflames',
    name: 'green flames',
    char: 'flames1',
    color: '#0df20d',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: ['flames1', 'flames2'],
    emitLight: true,
  },
}
