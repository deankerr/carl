import { Point } from './Shape/Point'
import { Rect } from './Shape/Rectangle'

export class DijkstraMap {
  map = new Map<Point, number>()
  time: number[] = []

  each(callback: ResultFn) {
    for (const [pt, val] of this.map) {
      callback(pt, val)
    }
  }

  initRect(rect: Rect, value: number) {
    rect.traverse(pt => this.map.set(pt, value))
  }

  get(pt: Point) {
    const val = this.map.get(pt)
    return val ?? 999999
  }

  getN4(pt: Point) {
    return pt.neighbours4().map(npt => this.get(npt))
  }

  calculate(callback?: ResultFn) {
    const t = Date.now()
    const next = new Map<Point, number>()
    let changed = false

    for (const [pt, val] of this.map) {
      const [n] = this.getN4(pt).sort((a, b) => a - b)
      if (val - n > 1) {
        next.set(pt, n + 1)
        changed = true
        callback ? callback(pt, n + 1) : ''
      } else {
        next.set(pt, val)
        callback ? callback(pt, val) : ''
      }
    }

    this.map = next
    this.time.push(Date.now() - t)

    if (!changed) {
      const total = this.time.reduce((a, c) => a + c)
      const avg = total / this.time.length
      console.log(
        'Dijkstra map complete - Avg:',
        avg.toFixed(2) + 'ms',
        'Total:',
        total + 'ms',
        'Loops:',
        this.time.length
      )
    }
    return changed
  }

  run(callback?: ResultFn) {
    if (this.calculate(callback)) this.run()
  }
}

type ResultFn = (pt: Point, val: number) => unknown
