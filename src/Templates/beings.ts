// import { CONFIG } from '../config'
import { EntityTemplate } from '../Core/Entity'

export type BeingKey = 'player' | 'spiderRed' | 'spiderBlack' | 'scorpionRed' | 'scorpionBlack'

export const beings: EntityTemplate[] = [
  {
    label: 'player',
    name: ['player'],
    form: ['@', '#EE82EE'],
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: [16],
  },
  {
    label: 'spiderRed',
    name: ['giant spider'],
    form: ['spiderRed1', '#EE82EE'],
    formSet: [['spiderRed1', '', '', 'spiderRed2', '', '']],
    formSetAutoCycle: [1000],
    tag: ['being', 'actor', 'blocksMovement'],
  },
  {
    label: 'spiderBlack',
    name: ['giant spider'],
    form: ['spiderBlack1', '#EE82EE'],
    formSet: [['spiderBlack1', '', '', 'spiderBlack2', '', '']],
    formSetAutoCycle: [1000],
    tag: ['being', 'actor', 'blocksMovement'],
    fieldOfView: [16],
  },
  {
    label: 'scorpionRed',
    name: ['giant spider'],
    form: ['scorpionRed1', '#EE82EE'],
    formSet: [['scorpionRed1', '', '', 'scorpionRed2', '', '']],
    formSetAutoCycle: [1000],
    tag: ['being', 'actor', 'blocksMovement'],
  },
  {
    label: 'scorpionBlack',
    name: ['giant scorpion'],
    form: ['scorpionBlack1', '#EE82EE'],
    formSet: [['scorpionBlack1', '', '', 'scorpionBlack2', '', '']],
    formSetAutoCycle: [1000],
    tag: ['being', 'actor', 'blocksMovement'],
    fieldOfView: [16],
  },
]
