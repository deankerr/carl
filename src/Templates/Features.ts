import { pick } from '../lib/util'

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
  statue: {
    id: 'statue',
    name: 'statue',
    char: 'statue',
    color: '#5f574f',
    tag: ['blocksLight'],
  },
  tombstone: {
    id: 'tombstone',
    name: 'tombstone',
    char: 'tombstone',
    color: '#5f574f',
    tag: ['walkable'],
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
  magentaFlames: {
    id: 'magentaflames',
    name: 'magenta flames',
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
  cyanFlames: {
    id: 'cyanflames',
    name: 'cyan flames',
    char: 'flames1',
    color: '#00FFFF',
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
  purpleFlames: {
    id: 'purpleflames',
    name: 'purple flames',
    char: 'flames1',
    color: '#8000FF',
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
  debugMarker: {
    id: 'debugMarker',
    name: 'debug marker',
    char: 'smallCheck',
    color: '#FF0000', //'#C8757B',
    tag: ['walkable'],
  },
}

export function randomFlameTemplate() {
  return pick([
    Features.blueFlames,
    Features.cyanFlames,
    Features.greenFlames,
    Features.magentaFlames,
    Features.magentaFlames,
    Features.flames,
    Features.purpleFlames,
    Features.redFlames,
  ])
}
