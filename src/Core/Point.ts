export class Point {
  constructor(public x: number, public y: number) {}

  str() {
    return `${this.x},${this.y}`
  }
}

export function Pt(x: number, y: number) {
  return new Point(x, y)
}
