// import * as ROT from 'rot-js'
import { pick, rnd } from '../util'
import { point, Point } from './Point'

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
  readonly center: Point

  readonly area: number
  readonly p1: Point
  readonly p2: Point

  constructor(pt: Point, width: number, height: number, public id = 0) {
    const { x, y } = pt
    this.x = x
    this.y = y

    this.x2 = x + width - 1
    this.y2 = y + height - 1

    this.width = width
    this.height = height

    this.cx = this.x2 - Math.floor(this.width / 2)
    this.cy = this.y2 - Math.floor(this.height / 2)
    this.center = point(this.cx, this.cy)

    this.area = width * height
    this.p1 = point(this.x, this.y)
    this.p2 = point(this.x2, this.y2)

    if (width < 0 || height < 0) console.warn('Negative size rect', this)
  }

  // Travels through the x/y coords
  traverse(callback: (pt: Point, edge: boolean) => unknown) {
    for (let yi = this.y; yi <= this.y2; yi++) {
      for (let xi = this.x; xi <= this.x2; xi++) {
        const pt = point(xi, yi)
        if (callback(pt, this.isEdgePt(pt)) === false) return
      }
    }
  }

  *each() {
    for (let yi = this.y; yi <= this.y2; yi++) {
      for (let xi = this.x; xi <= this.x2; xi++) {
        yield point(xi, yi)
      }
    }
  }

  intersectionPoints(rect: Rect) {
    if (this === rect)
      console.warn('Did you mean to check if a rect intersects itself?', this, rect)

    // Quick test if rects intersect
    if (this.x2 < rect.x || this.y2 < rect.y || this.x > rect.x2 || this.y > rect.y2) return []

    const ptSet = new Set<Point>()
    rect.traverse(pt => {
      if (this.pointIntersects(pt)) ptSet.add(pt)
    })

    return [...ptSet]
  }

  // Does a point intersect this Rect?
  pointIntersects(pt: Point) {
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
    const height = this.height + yBy * 2
    // enforce minimum of size 1 to avoid weirdness
    return Rect.at(point(x, y), width > 0 ? width : 1, height > 0 ? height : 1)
  }

  translate(x: number, y: number) {
    return Rect.at(point(this.x + x, this.y + y), this.width, this.height)
  }

  // Return list of each pt in the rect. outer = outermost edge only
  toPts(): Point[] {
    const result: Point[] = []
    this.traverse(pt => result.push(pt))
    return result
  }

  edgePoints(): Point[] {
    const result: Point[] = []
    this.traverse((pt, edge) => {
      if (edge) result.push(pt)
    })
    return result
  }

  isEdgePt(pt: Point) {
    return pt.x === this.x || pt.x === this.x2 || pt.y === this.y || pt.y === this.y2
  }

  // Return a random point with this rect
  rndPt() {
    return point(rnd(this.x, this.x2), rnd(this.y, this.y2))
  }

  // excludes corners
  rndEdgePt() {
    const r = rnd(0, 1)
    const x = r ? rnd(this.x + 1, this.x2 - 1) : pick([this.x, this.x2])
    const y = !r ? rnd(this.y + 1, this.y2 - 1) : pick([this.y, this.y2])
    return point(x, y)
  }

  cornerPts() {
    return [
      point(this.x, this.y),
      point(this.x2, this.y),
      point(this.x, this.y2),
      point(this.x2, this.y2),
    ]
  }

  centerPoint() {
    return point(this.cx, this.cy)
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
    return new Rect(point(x, y), width, height, id)
  }

  // From x/y to x2/y2
  static atxy2(pt: Point, pt2: Point, id = 0) {
    return new Rect(pt, pt2.x - pt.x + 1, pt2.y - pt.y + 1, id)
  }
}
