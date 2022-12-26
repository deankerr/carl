// TODO finalize structure. static methods rarely (never?) used. hollow rect?
// TODO Point class? (... level point manager?)
import * as ROT from 'rot-js'

type Point = { x: number; y: number }
// todo negative checks etc everywhere
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

  // debug label
  // label = ''
  id = -1
  readonly area: number

  constructor(x: number, y: number, width: number, height: number) {
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
  traverse(callback: (x: number, y: number) => unknown) {
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
    if (!Rect.intersects(this, rect)) return null

    const pts: { x: number; y: number }[] = []
    rect.traverse((x, y) => {
      if (Rect.intersectsPt(this, { x, y })) pts.push({ x, y })
    })

    return pts
  }

  intersectsPt(pt: { x: number; y: number }) {
    return Rect.intersectsPt(this, pt)
  }

  contains(r: Rect) {
    return this.x <= r.x && this.x2 >= r.x2 && this.y <= r.y && this.y2 >= r.y2
  }

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

  // corners(): Point[] {} ?

  rndPt(): Point {
    return { x: ROT.RNG.getUniformInt(this.x, this.x2), y: ROT.RNG.getUniformInt(this.y, this.y2) }
  }

  static at(x: number, y: number, width: number, height: number) {
    return new Rect(x, y, width, height)
  }

  static atC(cx: number, cy: number, width: number, height: number) {
    const x = cx - Math.floor(width / 2)
    const y = cy - Math.floor(height / 2)
    return new Rect(x, y, width, height)
  }

  static atxy2(x: number, y: number, x2: number, y2: number) {
    return new Rect(x, y, x2 - x + 1, y2 - y + 1)
  }

  static scaled(cx: number, cy: number, xScale: number, yScale: number) {
    const width = 2 * xScale - 1
    const height = 2 * yScale - 1
    const x1 = cx - Math.floor(width / 2)
    const y1 = cy - Math.floor(height / 2)

    return new Rect(x1, y1, width, height)
  }

  // ? will i ever use these
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
