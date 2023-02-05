import { repeat, rnd } from '../../lib/util'
import { point } from '../../Model/Point'
import { O2Module } from '../Overseer2'

export function cellularGrid(width: number, height: number, times: number, O2: O2Module) {
  const { terrain } = O2

  const wall = terrain('wall')
  const ground = terrain('ground')
  const snap = O2.snap('Cellular Automata')

  let grid1 = new BGrid(width, height, 45)

  grid1.each((x, y, v) => (v ? wall(point(x, y)) : ground(point(x, y))))
  snap()

  let grid2 = new BGrid(width, height)
  repeat(times, () => {
    grid2 = new BGrid(width, height, 0)
    grid1.each((x, y, v) => {
      if (v) {
        // wall, 4 neighbours to survive
        let count = 0
        point(x, y)
          .neighbours8()
          .forEach(pt => {
            if (grid1.get(pt.x, pt.y)) count++
          })
        grid2.set(x, y, count >= 4)
      } else {
        // open, 5 neighbours to become wall
        let count = 0
        point(x, y)
          .neighbours8()
          .forEach(pt => {
            if (grid1.get(pt.x, pt.y)) count++
          })
        grid2.set(x, y, count >= 5)
      }
    })

    grid2.each((x, y, v) => (v ? wall(point(x, y)) : ground(point(x, y))))
    snap()
    grid1 = grid2
  })
  return grid2
}

export class BGrid {
  g: boolean[][]
  constructor(readonly width: number, readonly height: number, p?: number) {
    this.g = [...new Array(height)].map(() => new Array(width))
    if (p) {
      this.each((x, y) => {
        this.set(x, y, rnd(100) < p)
      })
    }
  }

  // return out of bounds + 1 layer on the edge as a wall
  get(x: number, y: number) {
    if (x < 1 || x >= this.width - 1 || y < 1 || y >= this.height - 1) return true
    return this.g[y][x]
  }

  set(x: number, y: number, v: boolean) {
    this.g[y][x] = v
  }

  each(callback: (x: number, y: number, v: boolean) => unknown) {
    for (let yi = 0; yi < this.height; yi++) {
      for (let xi = 0; xi < this.width; xi++) {
        callback(xi, yi, this.get(xi, yi))
      }
    }
  }
}
