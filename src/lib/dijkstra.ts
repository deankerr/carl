import { Point } from './Shape/Point'

export class DijkstraMap {
  limit = 99
  domain: Set<Point>

  map = new Map<Point, number>()
  next = new Set<Point>()

  constructor(...initDomain: Point[]) {
    this.domain = new Set(initDomain)
  }

  start(...start: Point[]) {
    const t = Date.now()
    console.log('Start D2', start)

    for (const pt of start) {
      this.map.set(pt, 0)
      pt.neigh8(npt => this.queue(npt))
    }

    for (const pt of this.next) {
      const lowest = this.neighbours(pt)
      const val = lowest < this.limit ? lowest + 1 : this.limit
      this.map.set(pt, val)
    }

    console.log('D2 Complete:', Date.now() - t, 'ms')
  }

  get(pt: Point) {
    return this.map.get(pt) ?? this.limit
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
}

// type ResultFn = (pt: Point, val: number) => unknown
