import { Point } from './Shape/Point'

export class DijkstraMap {
  limit = 50
  domain = new Set<Point>()

  map = new Map<Point, number>()
  next = new Set<Point>()

  constructor(initDomain?: Point[]) {
    if (initDomain) this.domain = new Set(initDomain)
  }

  initialize(initDomain: Point[]) {
    this.domain = new Set(initDomain)
    this.map = new Map<Point, number>()
  }

  calculate(...goal: Point[]) {
    if (this.domain.size === 0 || goal.length === 0) {
      console.error('No domain/goal set for Dijkstra map')
      return
    }

    const t = Date.now()

    this.map = new Map<Point, number>()
    this.next = new Set<Point>()

    for (const pt of goal) {
      this.map.set(pt, 0)
      pt.neigh8(npt => this.queue(npt))
    }

    for (const pt of this.next) {
      const lowest = this.neighbours(pt)
      const val = lowest < this.limit ? lowest + 1 : this.limit
      this.map.set(pt, val)
    }

    // console.log('Dijkstra Map:', Date.now() - t, 'ms')
  }

  neighbours(pt: Point) {
    let lowest = this.limit
    for (const npt of pt.neighbours8()) {
      if (this.map.has(npt)) {
        const nVal = this.get(npt)
        if (nVal < lowest) lowest = nVal
      } else this.queue(npt)
    }

    return lowest
  }

  queue(pt: Point) {
    if (this.domain.has(pt)) this.next.add(pt)
  }

  get(pt: Point) {
    return this.map.get(pt) ?? this.limit
  }

  each(callback: ResultFn) {
    for (const [pt, val] of this.map) {
      callback(pt, val)
    }
  }

  debugPos(pt: Point) {
    console.log('debug heatmap pos', pt)
    for (let yi = -2; yi < 2; yi++) {
      for (let xi = -2; xi < 2; xi++) {
        const pt2 = pt.add(xi, yi)
        console.log(pt2, this.map.get(pt2))
      }
    }
  }
}

type ResultFn = (pt: Point, val: number) => unknown
