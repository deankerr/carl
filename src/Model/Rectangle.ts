// import * as ROT from 'rot-js'
import { pick, rnd } from '../lib/util'
import { Pt, Point } from './Point'

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

  constructor(pt: Point, width: number, height: number, public id = 0) {
    if (width < 1 || height < 1)
      throw new Error(
        `Please do not create zero/negative width Rects, as I cannot fathom them. w:${width} h: ${height}`
      )
    const { x, y } = pt
    this.x = x
    this.y = y

    this.x2 = x + width - 1
    this.y2 = y + height - 1

    this.width = width
    this.height = height

    this.cx = this.x2 - Math.floor(this.width / 2)
    this.cy = this.y2 - Math.floor(this.height / 2)

    this.area = width * height
  }

  // Travels through the x/y coords
  traverse(callback: (pt: Point, edge: boolean) => unknown) {
    for (let yi = this.y; yi <= this.y2; yi++) {
      for (let xi = this.x; xi <= this.x2; xi++) {
        const pt = Pt(xi, yi)
        if (callback(pt, this.isEdgePt(pt)) === false) return
      }
    }
  }

  // TODO handle arrays, ts generic
  // Tests if another Rect intersects this, if so returns the Pts where it does
  intersects(rect: Rect) {
    if (this === rect) console.warn('Did you mean to check if a rect intersects itself?', this, rect)

    // Quick test if rects intersect
    if (this.x2 < rect.x || this.y2 < rect.y || this.x > rect.x2 || this.y > rect.y2) return null

    const pts: string[] = []
    rect.traverse(pt => {
      if (this.intersectsPt(pt)) pts.push(pt.s)
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
    // enforce minimum of size 1 to avoid weirdness
    return Rect.at(Pt(x, y), width > 0 ? width : 1, height > 0 ? height : 1)
  }

  translate(x: number, y: number) {
    return Rect.at(Pt(this.x + x, this.y + y), this.width, this.height)
  }

  // Return list of each pt in the rect. outer = outermost edge only
  toPts(edgeOnly = false): Point[] {
    const result: Point[] = []
    this.traverse((pt, edge) => {
      if (!edgeOnly) result.push(pt)
      else if (edge) result.push(pt)
    })

    return result
  }

  // Return a random point with this rect
  rndPt() {
    return Pt(rnd(this.x, this.x2), rnd(this.y, this.y2))
  }

  // excludes corners
  rndEdgePt() {
    const r = rnd(0, 1)
    const x = r ? rnd(this.x + 1, this.x2 - 1) : pick([this.x, this.x2])
    const y = !r ? rnd(this.y + 1, this.y2 - 1) : pick([this.y, this.y2])
    return Pt(x, y)
  }

  cornerPts() {
    return [Pt(this.x, this.y), Pt(this.x2, this.y), Pt(this.x, this.y2), Pt(this.x2, this.y2)]
  }

  isEdgePt(pt: Point) {
    return pt.x === this.x || pt.x === this.x2 || pt.y === this.y || pt.y === this.y2
  }

  center() {
    return Pt(this.cx, this.cy)
  }

  // Construction

  // Constructor alias
  static at(pt: Point, width: number, height: number, id = 0) {
    return new Rect(pt, width, height, id)
  }

  // Center-point based
  static atC(pt: Point, width: number, height: number, id = 0) {
    const x = pt.x - Math.floor(width / 2)
    const y = pt.y - Math.floor(height / 2)
    return new Rect(Pt(x, y), width, height, id)
  }

  // From x/y to x2/y2
  static atxy2(pt: Point, pt2: Point, id = 0) {
    return new Rect(pt, pt2.x - pt.x + 1, pt2.y - pt.y + 1, id)
  }

  // By size, eg xSize 1 = 1, 2 = 3, 3 = 5 etc.
  // static scaled(cx: number, cy: number, xSize: number, ySize: number, id = 0) {
  //   const width = 2 * xSize - 1
  //   const height = 2 * ySize - 1
  //   const x1 = cx - Math.floor(width / 2)
  //   const y1 = cy - Math.floor(height / 2)

  //   return new Rect(x1, y1, width, height, id)
  // }
}
