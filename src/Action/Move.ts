import * as ROT from 'rot-js'
import { Direction } from './../util/direction'
import { ActionTypes } from './ActionTypes'

export type Move = {
  move: { dir: Direction; dx: number; dy: number }
}

export function move(dir: Direction): Move {
  switch (dir) {
    case Direction.NW:
      return { move: { dir, dx: -1, dy: -1 } }
    case Direction.N:
      return { move: { dir, dx: 0, dy: -1 } }
    case Direction.NE:
      return { move: { dir, dx: 1, dy: -1 } }
    case Direction.W:
      return { move: { dir, dx: -1, dy: 0 } }
    case Direction.WAIT:
      return { move: { dir, dx: 0, dy: 0 } }
    case Direction.E:
      return { move: { dir, dx: 1, dy: 0 } }
    case Direction.SW:
      return { move: { dir, dx: -1, dy: 1 } }
    case Direction.S:
      return { move: { dir, dx: 0, dy: 1 } }
    case Direction.SE:
      return { move: { dir, dx: 1, dy: 1 } }
  }
}

export function __randomMove(): ActionTypes {
  const dirs = [
    Direction.E,
    Direction.N,
    Direction.NE,
    Direction.NW,
    Direction.S,
    Direction.SE,
    Direction.SW,
    Direction.W,
    Direction.WAIT,
  ]
  const dir = ROT.RNG.getItem(dirs) as Direction
  return move(dir)
}

export function __wait(): ActionTypes {
  return move(Direction.WAIT)
}
