export class Point {
  readonly s: string
  constructor(readonly x: number, readonly y: number) {
    this.s = `${this.x},${this.y}`
  }

  add(vector: Point | string) {
    const pt = typeof vector === 'string' ? StrPt(vector) : vector
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

const neighbors = [Pt(0, -1), Pt(1, -1), Pt(1, 0), Pt(1, 1), Pt(0, 1), Pt(-1, 1), Pt(-1, 0), Pt(-1, -1)]
