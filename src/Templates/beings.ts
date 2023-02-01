import { EntityTemplate } from '../Core/Entity'

export type BeingKey = 'player' | 'spider' | 'ghost' | 'demon' | 'crab' | 'crab2'

export const beings: EntityTemplate[] = [
  {
    label: 'player',
    name: ['player'],
    form: ['@', '#EE82EE'],
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being'],
    fieldOfView: [12],
    emitLight: ['auto'],
    lightFlicker: [120],
    lightHueRotate: [0.02],
  },
  {
    label: 'spider',
    name: ['spider'],
    form: ['spider', '#00B3B3'],
    tag: ['actor', 'blocksMovement', 'being'],
  },
  {
    label: 'ghost',
    name: ['ghost'],
    form: ['ghost', '#FFFFFF'],
    tag: ['actor', 'blocksMovement', 'being'],
  },
  {
    label: 'demon',
    name: ['Natas, the mysterious wanderer'],
    form: ['demon', '#FF0000'],
    tag: ['actor', 'blocksMovement', 'being'],
  },
  {
    label: 'crab',
    name: ['crab'],
    form: ['crab', '#cc3131'],
    tag: ['actor', 'blocksMovement', 'being'],
  },
  {
    label: 'crab2',
    name: ['turncoat crab'],
    form: ['crab', '#32cd44'],
    tag: ['actor', 'blocksMovement', 'being'],
  },
]
