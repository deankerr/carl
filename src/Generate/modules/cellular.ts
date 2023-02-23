import { Point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'
import { rnd } from '../../lib/util'

type StatusFn = (pt: Point, alive: boolean) => unknown

// false = dead, true = alive
export class CellDish {
  cellsPrev = new Map<Point, boolean>()
  cellsCurrent = new Map<Point, boolean>()

  alwaysCells = new Set<Point>()
  neverCells = new Set<Point>()

  edge = true

  constructor(readonly rect: Rect) {
    rect.traverse(pt => {
      this.cellsPrev.set(pt, false)
      this.cellsCurrent.set(pt, false)
    })
  }

  // * status of each prev/current cell *
  prev(callback: StatusFn) {
    this.rect.traverse(pt => {
      if (!this.neverCells.has(pt)) callback(pt, this.inspectPrev(pt))
    })
  }

  inspectPrev(pt: Point) {
    if (this.alwaysCells.has(pt)) return true
    if (this.neverCells.has(pt)) return false
    return this.cellsPrev.get(pt) ?? this.edge
  }

  current(callback: StatusFn) {
    this.rect.traverse(pt => {
      if (!this.neverCells.has(pt)) callback(pt, this.inspectCurrent(pt))
    })
  }

  inspectCurrent(pt: Point) {
    if (this.alwaysCells.has(pt)) return true
    if (this.neverCells.has(pt)) return false
    return this.cellsCurrent.get(pt) ?? this.edge
  }

  // only alive cells
  alive(callback: StatusFn) {
    this.current((pt, status) => {
      if (status) callback(pt, status)
    })
  }

  // only changes, returned after each action
  changes(callback: StatusFn) {
    this.current((pt, alive) => {
      const p = this.inspectPrev(pt)
      if (p !== undefined && p !== alive) callback(pt, alive)
    })
  }

  // setter for current gen
  next(pt: Point, status: boolean) {
    this.cellsCurrent.set(pt, status)
  }

  // * Actions *

  addAlways(points: Point[]) {
    points.forEach(pt => {
      this.alwaysCells.add(pt)
      this.next(pt, true)
    })
    return this
  }

  // n = chance to become alive
  randomize(n: number) {
    this.swap()
    this.current(pt => {
      this.next(pt, rnd(100) < n)
    })

    this.debug('rand')
    return this
  }

  // for living cells, n = chance to die
  cull(n: number) {
    this.swap()
    this.prev((pt, alive) => {
      if (alive) this.next(pt, rnd(100) > n)
      else this.next(pt, alive)
    })

    this.debug('cull')
    return this.changes.bind(this)
  }

  // apply survival/birth rules to each cell
  generation(survive: number, birth: number) {
    this.swap()
    this.prev((pt, alive) => {
      if (this.countNeighbours(pt, alive ? survive : birth)) this.next(pt, true)
      else this.next(pt, false)
    })

    this.debug('gen')
    return this.changes.bind(this)
  }

  // * Utility *
  countNeighbours(pt: Point, required: number) {
    let count = 0
    for (const npt of pt.neighbours()) {
      // never = true attracts cells to walls
      if (this.neverCells.has(pt) || this.inspectPrev(npt)) {
        count++
        if (count >= required) return true
      }
    }
    return false
  }

  swap() {
    this.cellsPrev = this.cellsCurrent
    this.cellsCurrent = new Map<Point, boolean>()
  }

  alivePoints() {
    const results: Point[] = []
    this.alive(pt => results.push(pt))
    return results
  }

  showDebug = false
  debug(t?: string) {
    if (!this.showDebug) return
    console.group('* Dish status * ' + (t ?? ''))
    let row = 0
    let line = ''
    this.rect.traverse(pt => {
      if (pt.y !== row) {
        console.log(row, line)
        row = pt.y
        line = ''
      }
      if (this.alwaysCells.has(pt)) line += 'O'
      else if (this.neverCells.has(pt)) line += '='
      else line += this.cellsCurrent.get(pt) ? 'o' : '-'
    })
    console.log(row, line)

    let c = ''
    this.changes((pt, alive) => (c += pt.s + ' ' + alive + '|'))
    console.groupCollapsed('changes')
    console.log(c)
    console.groupEnd()

    console.log('prevCells:', this.cellsPrev)
    console.log('currnetCells:', this.cellsCurrent)
    console.groupEnd()
  }
}
