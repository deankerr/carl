import { EntityTemplate } from '../Core/Entity'
import { flameVariants, FlameKey } from './flames'

export type FeatureKey =
  | FlameKey
  | 'door'
  | 'shrub'
  | 'statue'
  | 'tombstone'
  | 'deadTree'
  | 'cactus'
  | 'deadShrub'

export const features: EntityTemplate[] = [
  {
    label: 'door',
    name: ['door'],
    form: ['doorClosed', '#73513d'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed'],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['doorClosed', '', '', 'doorOpen', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'shrub',
    name: ['shrub'],
    form: ['shrub', '#58a54a'],
    tag: ['memorable', 'feature'],
    trodOn: ['You trample the pathetic shrub.'],
  },
  {
    label: 'statue',
    name: ['statue'],
    form: ['statue', '#adadad'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement'],
  },
  {
    label: 'tombstone',
    name: ['tombstone'],
    form: ['tombstone', '#9c9c9c'],
    tag: ['memorable', 'feature', 'blocksLight'],
    trodOn: ['You bow your head solemnly in thoughtful prayer.'],
  },
  {
    label: 'deadTree',
    name: ['dead tree'],
    form: ['tree', '#602e15'],
    tag: ['memorable', 'feature', 'blocksLight'],
    trodOn: ['You smile as you continue to outlive this ancient tree.'],
  },
  {
    label: 'cactus',
    name: ['cactus'],
    form: ['cactus', '#0f840f'],
    tag: ['terrain'],
    trodOn: ['You collect some cactus spines with your skin.'],
  },
  {
    label: 'deadShrub',
    name: ['shrub'],
    form: ['shrub', '#6c2a14'],
    tag: ['memorable', 'feature'],
    trodOn: ['You trample the pathetic shrub.'],
  },
  ...flameVariants,
]
