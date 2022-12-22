import * as ROT from 'rot-js'

type Point = { x: number; y: number }

export class Rect {
  // Top left to bottom right
  readonly x: number
  readonly y: number
  readonly x2: number
  readonly y2: number

  readonly width: number
  readonly height: number

  // Center
  readonly cx: number
  readonly cy: number

  constructor(x: number, y: number, width: number, height: number) {
    // top left
    this.x = x
    this.y = y
    // bottom right
    this.x2 = x + width - 1
    this.y2 = y + height - 1

    this.width = width
    this.height = height

    // center
    this.cx = this.x2 - Math.floor(this.width / 2)
    this.cy = this.y2 - Math.floor(this.height / 2)
  }

  // Travels through the x/y coords
  traverse(callback: (x: number, y: number) => unknown) {
    // console.log('rect traverse')
    for (let yi = this.y; yi <= this.y2; yi++) {
      for (let xi = this.x; xi <= this.x2; xi++) {
        if (callback(xi, yi) === false) return // exit loop if false?
      }
    }
  }

  // TODO push most of this into static method?
  // TODO handle arrays, ts generic
  // TODO handle empty rect?
  intersects(rect: Rect) {
    // console.log('RectI.intersects() for', rect)

    // Doesn't intersect
    if (!Rect.intersects(this, rect)) return null

    // Otherwise, find pts that do
    const pts: { x: number; y: number }[] = []
    rect.traverse((x, y) => {
      if (Rect.intersectsPt(this, { x, y })) pts.push({ x, y })
    })

    return pts
  }

  intersectsPt(pt: { x: number; y: number }) {
    return Rect.intersectsPt(this, pt)
  }

  // clone() {
  //   return new Rect(this.x, this.y, this.width, this.height)
  // }

  scale(by: number) {
    // const cx = this.x2 - Math.floor(this.width / 2)
    // const cy = this.y2 - Math.floor(this.height / 2)
    // const xScale = this.width + by * 2
    // const yScale = this.height + by * 2
    // const x =
    const x = this.x - by
    const y = this.y - by
    const width = this.width + by * 2
    const height = this.height + by * 2
    return Rect.at(x, y, width, height)
  }

  rndPt(): Point {
    return { x: ROT.RNG.getUniformInt(this.x, this.x2), y: ROT.RNG.getUniformInt(this.y, this.y2) }
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

  // TODO do main checking here?
  static intersects(rect1: Rect, rect2: Rect) {
    if (rect1 === rect2) console.warn('Did you mean to check if a rect intersects itself?', rect1, rect2)
    return !(rect1.x2 < rect2.x || rect1.y2 < rect2.y || rect1.x > rect2.x2 || rect1.y > rect2.y2)
  }

  // TODO naming? "pt"? overload with rect:rect function?
  static intersectsPt(rect: Rect, pt: { x: number; y: number }) {
    return pt.x >= rect.x && pt.y >= rect.y && pt.x <= rect.x2 && pt.y <= rect.y2
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
