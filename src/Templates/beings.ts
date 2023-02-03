// import { CONFIG } from '../config'
import { EntityTemplate } from '../Core/Entity'

export type BeingKey =
  | 'player'
  | 'spider'
  | 'ghost'
  | 'demon'
  | 'crab'
  | 'crab2'
  | 'snake'
  | 'bloodGull'
  | 'warboy'
  | 'scorpion'

export const beings: EntityTemplate[] = [
  {
    label: 'player',
    name: ['player'],
    form: ['@', '#EE82EE'],
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: [16],
    // emitLight: ['auto', CONFIG.playerLight],
    // lightFlicker: [120],
    // lightHueRotate: [0.02],
  },
  {
    label: 'spider',
    name: ['spider'],
    form: ['spider', '#29adff'],
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
  {
    label: 'snake',
    name: ['snake'],
    form: ['snake', '#32cd32'],
    tag: ['actor', 'blocksMovement', 'being'],
  },
  {
    label: 'bloodGull',
    name: ['blood gull'],
    form: ['gull1', '#CC0000'],
    tag: ['actor', 'blocksMovement', 'being'],
    formSet: [['gull1', '', '', 'gull2', '', '']],
    formSetAutoCycle: [150],
  },
  {
    label: 'warboy',
    name: ['warboy'],
    form: ['tick1', '#9e0052'],
    tag: ['actor', 'blocksMovement', 'being'],
    formSet: [['tick1', '', '', 'tick2', '', '']],
    formSetAutoCycle: [1000],
  },
  {
    label: 'scorpion',
    name: ['scorpion'],
    form: ['scorpion1', '#ff8000'],
    tag: ['actor', 'blocksMovement', 'being'],
    formSet: [['scorpion1', '', '', 'scorpion2', '', '']],
    formSetAutoCycle: [1000],
  },
]