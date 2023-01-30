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

  grid(width: number, height: number, callback: (pt: Point) => unknown) {
    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        callback(this.pt(xi, yi))
      }
    }
  }
}

const PointMan = new PointManager()
export const point = PointMan.pt.bind(PointMan)
export const grid = PointMan.grid.bind(PointMan)

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

  neighbours4() {
    return neighbours4.map(n => this.add(n))
  }

  neighbours8() {
    return neighbours8.map(n => this.add(n))
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
const neighbours4 = [point(0, -1), point(1, 0), point(0, 1), point(-1, 0)]
