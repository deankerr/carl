import * as ROT from 'rot-js'
import { Direction, DIRECTIONS } from './../util/direction'
import { ActionTypes } from './ActionTypes'

export type Move = {
  move: { dir: Direction; dx: number; dy: number }
}

export const Move = (dir: Direction): Move => {
  switch (dir) {
    case 'NW':
      return { move: { dir, dx: -1, dy: -1 } }
    case 'N':
      return { move: { dir, dx: 0, dy: -1 } }
    case 'NE':
      return { move: { dir, dx: 1, dy: -1 } }
    case 'W':
      return { move: { dir, dx: -1, dy: 0 } }
    case 'WAIT':
      return { move: { dir, dx: 0, dy: 0 } }
    case 'E':
      return { move: { dir, dx: 1, dy: 0 } }
    case 'SW':
      return { move: { dir, dx: -1, dy: 1 } }
    case 'S':
      return { move: { dir, dx: 0, dy: 1 } }
    case 'SE':
      return { move: { dir, dx: 1, dy: 1 } }
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
