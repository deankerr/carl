import * as ROT from 'rot-js'
import { Direction, DIRECTIONS } from '../lib/direction'
import { ActionTypes } from './ActionTypes'

export type Move = {
  move: { dir: Direction; x: number; y: number }
}

export const Move = (dir: Direction): Move => {
  switch (dir) {
    case 'NW':
      return { move: { dir, x: -1, y: -1 } }
    case 'N':
      return { move: { dir, x: 0, y: -1 } }
    case 'NE':
      return { move: { dir, x: 1, y: -1 } }
    case 'W':
      return { move: { dir, x: -1, y: 0 } }
    case 'WAIT':
      return { move: { dir, x: 0, y: 0 } }
    case 'E':
      return { move: { dir, x: 1, y: 0 } }
    case 'SW':
      return { move: { dir, x: -1, y: 1 } }
    case 'S':
      return { move: { dir, x: 0, y: 1 } }
    case 'SE':
      return { move: { dir, x: 1, y: 1 } }
    default:
      throw new Error(`Unknown Move dir: '${dir}'`)
  }
}

export function __randomMove(): ActionTypes {
  const dir = ROT.RNG.getItem(Object.keys(DIRECTIONS)) as Direction
  return Move(dir)
}

export function __wait(): ActionTypes {
  return Move('WAIT')
}
