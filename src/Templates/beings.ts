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
  | 'warboy'
  | 'scorpion'
  | 'bigMozzie'
  | 'mozzie'

export const beings: EntityTemplate[] = [
  {
    label: 'player',
    name: ['player'],
    form: ['@', '#EE82EE'],
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: [16],
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
  {
    label: 'bigMozzie',
    name: ['mozzie queen'],
    form: ['bigMozzie1', '#CC0000'],
    tag: ['actor', 'blocksMovement', 'being'],
    formSet: [['bigMozzie1', '', '', 'bigMozzie2', '', '']],
    formSetAutoCycle: [150],
  },
  {
    label: 'mozzie',
    name: ['mozzies'],
    form: ['mozzie1', '#CC0000'],
    tag: ['actor', 'blocksMovement', 'being'],
    formSet: [['mozzie1', '', '', 'mozzie2', '', '']],
    formSetAutoCycle: [60],
  },
]
