import { EntityTemplate } from '../Core/Entity'

export type FeatureKey = 'door' | 'shrub' | 'statue' | 'tombstone' | 'flames' | 'deadTree'
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
    tag: ['memorable', 'feature'],
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
    label: 'flames',
    name: ['flames'],
    form: ['flames1', '#FF8000'],
    tag: ['feature', 'renderUnderBeing'],
    trodOn: ['You crackle and pop as you wade through the flames.'],
    formSet: [['flames1', '', '', 'flames2', '', '']],
    formSetAutoCycle: [120],
    emitLight: ['auto'],
    lightFlicker: [120],
  },
]
