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
    tiles: ['woodenDoorClosed', 'woodenDoorOpen'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    tileTriggers: ['isClosed', 'isOpen'],
    tileVariant: ['woodenDoorV', 'woodenDoorVNorth'],
  },
  {
    label: 'woodenDoorV',
    name: ['door'],
    tiles: ['woodenDoorVClosed', 'woodenDoorVOpen'],
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
    tileTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'woodenDoorVNorth',
    name: ['door'],
    tiles: ['woodenDoorVClosedNorth', 'woodenDoorVOpenNorth'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    tileTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'stoneDoor',
    name: ['door'],
    tiles: ['stoneDoorClosed', 'stoneDoorOpen'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    tileTriggers: ['isClosed', 'isOpen'],
    tileVariant: ['stoneDoorV', 'stoneDoorVNorth'],
  },
  {
    label: 'stoneDoorV',
    name: ['door'],
    tiles: ['stoneDoorVClosed', 'stoneDoorVOpen'],
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
    tileTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'stoneDoorVNorth',
    name: ['door'],
    tiles: ['stoneDoorVClosedNorth', 'stoneDoorVOpenNorth'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement', 'isClosed', 'door'],
    trodOn: ['You carefully backflip through the door.'],
    tileTriggers: ['isClosed', 'isOpen'],
  },
  {
    label: 'web',
    name: ['web'],
    tiles: ['web1'],
    tag: ['feature'],
  },
  {
    label: 'lilypad1',
    name: ['lilypad'],
    tiles: ['lilypad11', 'lilypad12'],
    tilesAutoCycle: [1000],
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad2',
    name: ['lilypad'],
    tiles: ['lilypad21', 'lilypad22'],
    tilesAutoCycle: [1000],
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad3',
    name: ['lilypad'],
    tiles: ['lilypad31', 'lilypad32'],
    tilesAutoCycle: [1000],
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'lilypad4',
    name: ['lilypad'],
    tiles: ['lilypad41', 'lilypad42'],
    tilesAutoCycle: [1000],
    tag: ['feature'],
    trodOn: ['You bounce off the lilypad.'],
  },
  {
    label: 'cactus',
    name: ['cactus'],
    tiles: ['cactus'],
    tag: ['feature'],
  },
  ...debug,
]
