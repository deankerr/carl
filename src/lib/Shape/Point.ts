class PointManager {
  store = new Map<string, Point>()
  count = 0

  pt(x: number, y: number) {
    const s = x + ',' + y
    const storedPt = this.store.get(s)
    if (storedPt) return storedPt

    const pt = new Point(x, y, this.count++)
    this.store.set(s, pt)
    return pt
  }

  rect(x: number, y: number, width: number, height: number, callback: (pt: Point) => unknown) {
    for (let yi = y; yi < height; yi++) {
      for (let xi = x; xi < width; xi++) {
        callback(this.pt(xi, yi))
      }
    }
  }

  __debug_count() {
    const count: Record<string, number> = {}
    for (const [k] of this.store) {
      if (!count[k]) count[k] = 1
      else count[k]++
    }
    console.log('count:', count)
  }
}

const PointMan = new PointManager()
window.pointMan = PointMan
export const point = PointMan.pt.bind(PointMan)
export const pointRect = PointMan.rect.bind(PointMan)

export class Point {
  readonly s: string
  constructor(readonly x: number, readonly y: number, readonly pID = 0) {
    this.s = `${this.x},${this.y}`
  }

  add(vector: Point | string | number, y?: number) {
    let pt: Point
    if (typeof vector === 'number') {
      if (typeof y === 'number') pt = point(vector, y)
      else throw new Error('Both parameters must be number')
    } else if (typeof vector === 'string') {
      pt = strToPt(vector)
    } else pt = vector

    return point(this.x + pt.x, this.y + pt.y)
  }

  addPt(pt: Point) {
    return point(this.x + pt.x, this.y + pt.y)
  }

  mul(by: number) {
    return point(this.x * by, this.y * by)
  }

  neighbours4() {
    return neighbours4.map(n => this.addPt(n))
  }

  neighbours8() {
    return neighbours8.map(n => this.addPt(n))
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

  neigh8(callback: (npt: Point) => unknown) {
    neighbours8.forEach(npt => callback(this.addPt(npt)))
  }
}

export function strToPt(s: string | Point) {
  if (typeof s === 'string') {
    const pt = s.split(',')
    return PointMan.pt(parseInt(pt[0]), parseInt(pt[1]))
  } else return s
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
