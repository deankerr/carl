// essentially a 2D array
// for storing things at x/y coordinates
// ? Points lookup?

export class Grid<T> {
  private grid: T[][]

  private constructor(values: T[][]) {
    this.grid = values
  }

  get(x: number, y: number) {
    if (!this.inBounds(x, y)) return null
    return this.grid[y][x]
  }

  set(x: number, y: number, value: T) {
    if (!this.inBounds(x, y)) return
    this.grid[y][x] = value
  }

  each(callback: (x: number, y: number, value: T) => void | null) {
    this.grid.forEach((row, yi) =>
      row.forEach((value, xi) => {
        // return null to exit loop
        if (callback(xi, yi, value) === null) return
      })
    )
  }

  inBounds(x: number, y: number) {
    return x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length
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
