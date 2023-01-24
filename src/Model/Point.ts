export class Point {
  readonly s: string
  constructor(readonly x: number, readonly y: number) {
    this.s = `${this.x},${this.y}`
  }

  add(vector: Point | string | number, y?: number) {
    let pt: Point
    if (typeof vector === 'number') {
      if (typeof y === 'number') pt = Pt(vector, y)
      else throw new Error('Both parameters must be number')
    } else if (typeof vector === 'string') {
      pt = StrPt(vector)
    } else pt = vector

    return Pt(this.x + pt.x, this.y + pt.y)
  }

  neighbors() {
    return neighbors.map(n => this.add(n))
  }
}

export function Pt(x: number, y: number) {
  return new Point(x, y)
}

export function StrPt(s: string) {
  const pt = s.split(',')
  return new Point(parseInt(pt[0]), parseInt(pt[1]))
}

export function PtSet(...args: Point[] | string[]) {
  const set = new Set<string>()

  for (const a of args) {
    if (typeof a === 'string') {
      set.add(a)
    } else {
      set.add(a.s)
    }
  }

  const toPt = () => {
    const sPtA = [...set]
    return sPtA.map(pts => StrPt(pts))
  }
  return { set, toPt }
}

const neighbors = [Pt(0, -1), Pt(1, -1), Pt(1, 0), Pt(1, 1), Pt(0, 1), Pt(-1, 1), Pt(-1, 0), Pt(-1, -1)]
