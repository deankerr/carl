export class Point {
  readonly s: string
  constructor(readonly x: number, readonly y: number) {
    this.s = `${this.x},${this.y}`
  }

  add(vector: Point) {
    return Pt(this.x + vector.x, this.y + vector.y)
  }
}

export function Pt(x: number, y: number) {
  return new Point(x, y)
}
