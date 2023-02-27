import { EntityTemplate } from '../Core'

export const liquid = {
  water: {
    name: 'water',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['water1', 'water2'],
      ledge: ['waterLedge1', 'waterLedge2'],
      animate: ['cycle', 1000],
    },
  },

  slime: {
    name: 'slime',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['slime1', 'slime2'],
      ledge: ['slimeLedge1', 'slimeLedge2'],
      animate: ['cycle', 1000],
    },
  },

  oil: {
    name: 'oil',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['oil1', 'oil2'],
      ledge: ['oilLedge1', 'oilLedge2'],
      animate: ['random', 1000],
    },
  },

  acid: {
    name: 'acid',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['acid1', 'acid2', 'acidClear'],
      ledge: ['acidLedge1', 'acidLedge2', 'acidClearLedge'],
      animate: ['random', 1000],
    },
  },

  blood: {
    name: 'blood',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['blood1', 'blood2', 'bloodClear'],
      ledge: ['bloodLedge1', 'bloodLedge2', 'bloodClearLedge'],
      animate: ['random', 1000],
    },
  },

  sludge: {
    name: 'sludge',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['sludge1', 'sludge2'],
      ledge: ['sludgeLedge1', 'sludgeLedge2'],
      animate: ['random', 1000],
    },
  },
} satisfies Record<string, EntityTemplate>
