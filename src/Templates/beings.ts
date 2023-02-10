// import { CONFIG } from '../config'
import { EntityTemplate } from '../Core/Entity'

export type BeingKey = 'player' | 'spiderRed' | 'spiderBlack' | 'scorpionRed' | 'scorpionBlack'

export const beings: EntityTemplate[] = [
  {
    label: 'player',
    name: ['player'],
    tiles: ['@'],
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: [16],
  },
  {
    label: 'spiderRed',
    name: ['giant spider'],
    tiles: ['spiderRed1', 'spiderRed2'],
    tilesAutoCycle: [1000],
    tag: ['being', 'actor', 'blocksMovement'],
  },
  {
    label: 'spiderBlack',
    name: ['giant spider'],
    tiles: ['spiderBlack1', 'spiderBlack2'],
    tilesAutoCycle: [1000],
    tag: ['being', 'actor', 'blocksMovement'],
  },
  {
    label: 'scorpionRed',
    name: ['giant spider'],
    tiles: ['scorpionRed1', 'scorpionRed2'],
    tilesAutoCycle: [1000],
    tag: ['being', 'actor', 'blocksMovement'],
  },
  {
    label: 'scorpionBlack',
    name: ['giant scorpion'],
    tiles: ['scorpionBlack1', 'scorpionBlack2'],
    tilesAutoCycle: [1000],
    tag: ['being', 'actor', 'blocksMovement'],
  },
]
