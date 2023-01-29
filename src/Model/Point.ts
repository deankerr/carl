export class Point {
  readonly s: string
  constructor(readonly x: number, readonly y: number, readonly pID = 0) {
    this.s = `${this.x},${this.y}`
  }

  add(vector: Point | string | number, y?: number) {
    let pt: Point
    if (typeof vector === 'number') {
      if (typeof y === 'number') pt = Pt(vector, y)
      else throw new Error('Both parameters must be number')
    } else if (typeof vector === 'string') {
      pt = strToPt(vector)
    } else pt = vector

    return new Point(this.x + pt.x, this.y + pt.y)
  }

  neighbors() {
    return neighbors.map(n => this.add(n))
  }

  orthNeighbours() {
    return orthNeighbours.map(o => this.add(o))
  }
}

function Pt(x: number, y: number) {
  return new Point(x, y)
}

export function strToPt(s: string | Point) {
  if (typeof s === 'string') {
    const pt = s.split(',')
    return new Point(parseInt(pt[0]), parseInt(pt[1]))
  } else return s
}

export function ptToStr(pt: Point | string) {
  if (typeof pt === 'string') {
    return pt
  } else {
    return pt.s
  }
}

export class PointSet {
  private set = new Set<string>()
  constructor(...args: Point[] | string[]) {
    for (const pt of args) {
      if (typeof pt === 'string') {
        this.set.add(pt)
      } else {
        this.set.add(pt.s)
      }
    }
  }

  add(pt: Point | string) {
    this.set.add(ptToStr(pt))
  }

  has(pt: Point | string) {
    return this.set.has(ptToStr(pt))
  }

  del(...args: Point[] | string[]) {
    args.forEach(a => this.set.delete(ptToStr(a)))
  }

  toPt() {
    const sPtA = [...this.set]
    return sPtA.map(pts => strToPt(pts))
  }
}

const neighbors = [Pt(0, -1), Pt(1, -1), Pt(1, 0), Pt(1, 1), Pt(0, 1), Pt(-1, 1), Pt(-1, 0), Pt(-1, -1)]
const orthNeighbours = [Pt(0, -1), Pt(1, 0), Pt(0, 1), Pt(-1, 0)]

export class PointManager {
  points = new Map<string, Point>()
  count = 0

  pt(x: number, y: number) {
    const s = x + ',' + y
    const storedPt = this.points.get(s)
    if (storedPt) return storedPt
    const pt = new Point(x, y, this.count++)
    this.points.set(s, pt)
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
