export class Point {
  readonly s: string
  constructor(readonly x: number, readonly y: number) {
    this.s = `${this.x},${this.y}`
  }
}

export function Pt(x: number, y: number) {
  return new Point(x, y)
}
