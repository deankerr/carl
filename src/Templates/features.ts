import { EntityTemplate } from '../Core/Entity'
import { debug, DebugKeys } from './debug'

export type FeatureKey =
  | DebugKeys
  | '[clear]'
  | 'woodenDoor'
  | 'woodenDoorV'
  | 'woodenDoorVNorth'
  | 'stoneDoor'
  | 'stoneDoorV'
  | 'stoneDoorVNorth'
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
    tile: ['woodenDoorClosed', ''],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['woodenDoorClosed', '', '', 'woodenDoorOpen', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
    tileVariant: ['woodenDoorV', 'woodenDoorVNorth'],
  },
  {
    label: 'woodenDoorV',
    name: ['door'],
    tile: ['woodenDoorVClosed', ''],
    tag: [
      'memorable',
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'hasDoorNorth',
      'renderAbove',
    ],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['woodenDoorVClosed', '', '', 'woodenDoorVOpen', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'woodenDoorVNorth',
    name: ['door'],
    tile: ['woodenDoorVClosedNorth', ''],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['woodenDoorVClosedNorth', '', '', 'woodenDoorVOpenNorth', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'stoneDoor',
    name: ['door'],
    tile: ['stoneDoorClosed', ''],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['stoneDoorClosed', '', '', 'stoneDoorOpen', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
    tileVariant: ['stoneDoorV', 'stoneDoorVNorth'],
  },
  {
    label: 'stoneDoorV',
    name: ['door'],
    tile: ['stoneDoorVClosed', ''],
    tag: [
      'memorable',
      'feature',
      'blocksLight',
      'blocksMovement',
      'isClosed',
      'door',
      'hasDoorNorth',
      'renderAbove',
    ],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['stoneDoorVClosed', '', '', 'stoneDoorVOpen', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'stoneDoorVNorth',
    name: ['door'],
    tile: ['stoneDoorVClosedNorth', ''],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    formSet: [['stoneDoorVClosedNorth', '', '', 'stoneDoorVOpenNorth', '', '']],
    formSetTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'web',
    name: ['web'],
    tile: ['web1', '', ''],
    tag: ['feature'],
  },
  {
    label: 'lilypad1',
    name: ['lilypad'],
    tile: ['lilypad11', '', ''],
    formSet: [['lilypad11', '', '', 'lilypad12', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad2',
    name: ['lilypad'],
    tile: ['lilypad21', '', ''],
    formSet: [['lilypad21', '', '', 'lilypad22', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad3',
    name: ['lilypad'],
    tile: ['lilypad31', '', ''],
    formSet: [['lilypad31', '', '', 'lilypad32', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad4',
    name: ['lilypad'],
    tile: ['lilypad41', '', ''],
    formSet: [['lilypad41', '', '', 'lilypad42', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'cactus',
    name: ['cactus'],
    tile: ['cactus', '', ''],
    tag: ['feature'],
  },
  ...debug,
]
