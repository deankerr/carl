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
    color: '#FF8000',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: {
      list: ['flames1', 'flames2'],
      frequency: 120,
    },
    emitLight: {
      flicker: 120,
    },
  },
  blueFlames: {
    id: 'blueflames',
    name: 'blue flames',
    char: 'flames1',
    color: '#0000FF',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: {
      list: ['flames1', 'flames2'],
      frequency: 120,
    },
    emitLight: {
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
      flicker: 120,
    },
  },
  redFlames: {
    id: 'redflames',
    name: 'red flames',
    char: 'flames1',
    color: '#FF0000',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: {
      list: ['flames1', 'flames2'],
      frequency: 120,
    },
    emitLight: {
      flicker: 120,
    },
  },
  yellowFlames: {
    id: 'yellowflames',
    name: 'yellow flames',
    char: 'flames1',
    color: '#FFFF00',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: {
      list: ['flames1', 'flames2'],
      frequency: 120,
    },
    emitLight: {
      flicker: 120,
    },
  },
  pinkFlames: {
    id: 'pinkflames',
    name: 'pink flames',
    char: 'flames1',
    color: '#FF00FF',
    tag: ['walkable'],
    trodOn: 'You crisp up nicely as you stand in the flames.',
    cycleGraphic: {
      list: ['flames1', 'flames2'],
      frequency: 120,
    },
    emitLight: {
      flicker: 120,
    },
  },
}
