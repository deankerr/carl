import { Direction } from './../util/direction'

export type Move = {
  move: { dir: Direction; dx: number; dy: number }
}

export function Move(dir: Direction): Move {
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
