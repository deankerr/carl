import { EntityTemplate } from '../Core/Entity'
import { flameVariants, FlameKey } from './flames'
import { debug, DebugKeys } from './debug'

export type FeatureKey =
  | DebugKeys
  | '[clear]'
  | 'woodenDoor'
  | 'web'
  | 'lilypad1'
  | 'lilypad2'
  | 'lilypad3'
  | 'lilypad4'
  | 'cactus'

export const features: EntityTemplate[] = [
  {
    label: 'woodenDoor',
    name: ['door'],
    form: ['woodenDoorClosed', ''],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed'],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['woodenDoorClosed', '', '', 'woodenDoorOpen', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'stoneDoor',
    name: ['door'],
    form: ['stoneDoorClosed', ''],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed'],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['stoneDoorClosed', '', '', 'stoneDoorOpen', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'web',
    name: ['web'],
    form: ['web1', '', ''],
    tag: ['feature', 'renderUnderBeing'],
  },
  {
    label: 'lilypad1',
    name: ['lilypad'],
    form: ['lilypad11', '', ''],
    formSet: [['lilypad11', '', '', 'lilypad12', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature', 'renderUnderBeing'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad2',
    name: ['lilypad'],
    form: ['lilypad21', '', ''],
    formSet: [['lilypad21', '', '', 'lilypad22', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature', 'renderUnderBeing'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad3',
    name: ['lilypad'],
    form: ['lilypad31', '', ''],
    formSet: [['lilypad31', '', '', 'lilypad32', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature', 'renderUnderBeing'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad4',
    name: ['lilypad'],
    form: ['lilypad41', '', ''],
    formSet: [['lilypad41', '', '', 'lilypad42', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature', 'renderUnderBeing'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'cactus',
    name: ['cactus'],
    form: ['cactus', '', ''],
    tag: ['feature', 'renderUnderBeing'],
  },
  ...debug,
]
