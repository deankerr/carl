// export const Point = (x: number, y: number) => {
//   return { x, y }
// }

// export interface Rect {}

export class Rect {
  readonly x: number
  readonly y: number
  readonly x2: number
  readonly y2: number

  readonly width: number
  readonly height: number

  constructor(x: number, y: number, width: number, height: number) {
    // top left
    this.x = x
    this.y = y
    // bottom right
    this.x2 = x + width - 1
    this.y2 = y + height - 1

    this.width = width
    this.height = height
  }

  // Travels through the x/y coords
  traverse(callback: (x: number, y: number) => unknown) {
    console.log('rect traverse')
    for (let yi = this.y; yi < this.y + this.height - 1; yi++) {
      for (let xi = this.x; xi <= this.x + this.width - 1; xi++) {
        if (callback(xi, yi) === false) return // exit loop if false?
      }
    }
  }

  static at(x: number, y: number, width: number, height: number) {
    return new Rect(x, y, width, height)
  }

  static scaled(x: number, y: number, xScale: number, yScale: number) {
    const width = 2 * xScale - 1
    const height = 2 * yScale - 1
    const x1 = x - Math.floor(width / 2)
    const y1 = y - Math.floor(height / 2)

    return new Rect(x1, y1, width, height)
  }
}

// export function RectXY(x: number, y: number, width: number, height: number) {
//   return new Rect(x, y, width, height)
// }
// // 1 = 1, 2 = 3, 3 = 5, 4 = 7
// // scale => w/h in odd numbered increments
// export function RectC(x: number, y: number, xScale: number, yScale: number) {
//   const width = 2 * xScale - 1
//   const height = 2 * yScale - 1
//   const x1 = x - Math.floor(width / 2)
//   const y1 = y - Math.floor(height / 2)

//   return new Rect(x1, y1, width, height)
// }
