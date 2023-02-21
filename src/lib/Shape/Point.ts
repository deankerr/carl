class PointManager {
  cache = new Map<string, Point>()

  pt(x: number, y: number) {
    const s = x + ',' + y
    const cached = this.cache.get(s)
    if (cached) return cached

    const pt = new Point(x, y)
    this.cache.set(s, pt)
    return pt
  }
}

const PointMan = new PointManager()
export const point = PointMan.pt.bind(PointMan)

export class Point {
  readonly s: string
  private neighboursCache: Point[] | undefined

  constructor(readonly x: number, readonly y: number) {
    this.s = `${this.x},${this.y}`
  }

  add(vec: Point | number, y?: number) {
    let pt: Point
    if (typeof vec === 'number') {
      if (typeof y !== 'number') throw new Error('Both parameters must be number')
      pt = point(vec, y)
    } else pt = vec

    return point(this.x + pt.x, this.y + pt.y)
  }

  mul(by: number) {
    return point(this.x * by, this.y * by)
  }

  neighbours4() {
    return neighbours4.map(n => this.add(n))
  }

  neighbours() {
    if (this.neighboursCache) return this.neighboursCache
    this.neighboursCache = neighbours8.map(vec => this.add(vec))
    return this.neighboursCache
  }

  north(n = 1) {
    return this.add(0, -n)
  }

  east(n = 1) {
    return this.add(n, 0)
  }

  south(n = 1) {
    return this.add(0, n)
  }

  west(n = 1) {
    return this.add(-n, 0)
  }
}

const neighbours8 = [
  point(0, -1),
  point(1, -1),
  point(1, 0),
  point(1, 1),
  point(0, 1),
  point(-1, 1),
  point(-1, 0),
  point(-1, -1),
]

export const neighbours4 = [point(0, -1), point(1, 0), point(0, 1), point(-1, 0)]

declare global {
  interface Window {
    pointMan: PointManager
  }
}
