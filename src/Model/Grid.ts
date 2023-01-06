// essentially a 2D array
// for storing things at x/y coordinates
import { Point, Pt } from './Point'

export class Grid<T> {
  private grid: T[][]

  private constructor(values: T[][]) {
    this.grid = values
  }

  get(pt: Point) {
    if (!this.inBounds(pt)) return null
    return this.grid[pt.y][pt.x]
  }

  set(pt: Point, value: T) {
    if (!this.inBounds(pt)) return
    this.grid[pt.y][pt.x] = value
  }

  each(callback: (pt: Point, value: T) => void | null) {
    this.grid.forEach((row, yi) =>
      row.forEach((value, xi) => {
        // return null to exit loop
        if (callback(Pt(xi, yi), value) === null) return
      })
    )
  }

  inBounds(pt: Point) {
    return pt.x >= 0 && pt.x < this.grid[0].length && pt.y >= 0 && pt.y < this.grid.length
  }

  static from<U>(values: U[][]): Grid<U> {
    return new Grid<U>(values)
  }

  static fill<U>(width: number, height: number, fill: U): Grid<U> {
    const values = [...new Array(height)].map(() => new Array<U>(width).fill(fill))
    const grid = new Grid<U>(values)
    return grid
  }
}
