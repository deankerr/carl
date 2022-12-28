// ? hollow rect support?
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

  readonly area: number

  // debug id
  id

  constructor(x: number, y: number, width: number, height: number, id = 0) {
    if (width < 1 || height < 1)
      throw new Error('Please do not create zero/negative width Rects, as I cannot fathom them.')

    this.x = x
    this.y = y

    this.x2 = x + width - 1
    this.y2 = y + height - 1

    this.width = width
    this.height = height

    this.cx = this.x2 - Math.floor(this.width / 2)
    this.cy = this.y2 - Math.floor(this.height / 2)

    this.area = width * height

    this.id = id
  }

  // Travels through the x/y coords
  traverse(callback: (x: number, y: number) => unknown) {
    for (let yi = this.y; yi <= this.y2; yi++) {
      for (let xi = this.x; xi <= this.x2; xi++) {
        if (callback(xi, yi) === false) return // exit loop if false?
      }
    }
  }

  // TODO handle arrays, ts generic
  // Tests if another Rect intersects this, if so returns the Pts where it does
  intersects(rect: Rect) {
    if (this === rect) console.warn('Did you mean to check if a rect intersects itself?', this, rect)

    // Quick test if rects intersect
    if (this.x2 < rect.x || this.y2 < rect.y || this.x > rect.x2 || this.y > rect.y2) return null

    const pts: { x: number; y: number }[] = []
    rect.traverse((x, y) => {
      if (this.intersectsPt({ x, y })) pts.push({ x, y })
    })

    return pts
  }

  // Does a point intersect this Rect?
  intersectsPt(pt: Point) {
    return pt.x >= this.x && pt.y >= this.y && pt.x <= this.x2 && pt.y <= this.y2
  }

  // Is a rect fully contained within this rect (or overlap perfectly)?
  contains(rect: Rect) {
    return this.x <= rect.x && this.x2 >= rect.x2 && this.y <= rect.y && this.y2 >= rect.y2
  }

  // Return a clone of this rect, scaled by a given amount
  scale(xBy: number, yBy = xBy) {
    const x = this.x - xBy
    const y = this.y - yBy
    const width = this.width + xBy * 2
    const height = this.height + xBy * 2
    return Rect.at(x, y, width, height)
  }

  // Return list of each pt in the rect. outer = outermost edge only
  toPts(outer = false): Point[] {
    const result: Point[] = []
    this.traverse((x, y) => {
      if (!outer) result.push({ x, y })
      else if (x == this.x || x == this.x2 || y == this.y || y == this.y2) result.push({ x, y })
    })

    return result
  }

  // Return a random point with this rect
  rndPt(): Point {
    return { x: ROT.RNG.getUniformInt(this.x, this.x2), y: ROT.RNG.getUniformInt(this.y, this.y2) }
  }

  // ? rndPtOuter()

  // Construction

  // Constructor alias
  static at(x: number, y: number, width: number, height: number, id = 0) {
    return new Rect(x, y, width, height, id)
  }

  // Center-point based
  static atC(cx: number, cy: number, width: number, height: number, id = 0) {
    const x = cx - Math.floor(width / 2)
    const y = cy - Math.floor(height / 2)
    return new Rect(x, y, width, height, id)
  }

  // From x/y to x2/y2
  static atxy2(x: number, y: number, x2: number, y2: number, id = 0) {
    return new Rect(x, y, x2 - x + 1, y2 - y + 1, id)
  }

  // By size, eg xSize 1 = 1, 2 = 3, 3 = 5 etc.
  static scaled(cx: number, cy: number, xSize: number, ySize: number, id = 0) {
    const width = 2 * xSize - 1
    const height = 2 * ySize - 1
    const x1 = cx - Math.floor(width / 2)
    const y1 = cy - Math.floor(height / 2)

    return new Rect(x1, y1, width, height, id)
  }
}
