import { Region } from '../../Core'
import { Queue, rnd } from '../../lib/util'
import { point, Point, pointRect } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'
import { O2Module } from '../Overseer2'

export function flood(startPt: Point, maxSize: number, O2: O2Module) {
  const region = O2.region
  const water = O2.terrain('water')

  const queue = new Queue<Point>()
  const checked = new Set<Point>()
  const neighbours = new Set<Point>()
  const success = new Set<Point>()

  let size = 0
  queue.add(startPt)

  while (size < maxSize) {
    const pt = queue.next()
    if (!pt) break

    checked.add(pt)
    if (!O2.region.terrainAt(pt).blocksMovement) {
      water(pt)
      success.add(pt)

      pt.neighbours8().forEach(npt => {
        if (!checked.has(npt)) neighbours.add(npt)
      })
    }

    if (queue.queue.length === 0) {
      queue.queue = [...neighbours]
      neighbours.clear()
      size++
      O2.snapshot('A flood is in progress')
    }
  }
  // O2.snap('lake')()
  return success
}

export function lake(pts: Set<Point>, O2: O2Module) {
  const cactus = O2.terrain('cactus')
  const water = O2.terrain('water')
  const ground = O2.terrain('ground')

  const dish = new CellDish()

  // dish.never = never
  dish.initialize(pts, 'alive')

  dish.randomize(85)
  dish.inspect((pt, cell) => (cell === 'alive' ? water(pt) : ground(pt)))
  O2.snapshot('Randomize')

  dish.edge = pt => {
    if (O2.region.terrainAt(pt).blocksMovement) return 'alive'
    return 'dead'
  }

  dish.generation(5, 8)
  dish.inspect((pt, cell) => (cell === 'alive' ? water(pt) : ground(pt)))
  O2.snapshot('Cell Gen 1')

  dish.generation(4, 5)
  dish.inspect((pt, cell) => (cell === 'alive' ? water(pt) : ground(pt)))
  O2.snapshot('Cell Gen 2')

  dish.generation(4, 5)
  dish.inspect((pt, cell) => (cell === 'alive' ? water(pt) : ground(pt)))
  O2.snapshot('Cell Gen 3')
}

type Cell = 'alive' | 'dead'

class CellDish {
  current = new Map<Point, Cell>()
  next = new Map<Point, Cell>()

  always = new Set<Point>()
  never = new Set<Point>()

  edge = (pt: Point): Cell => 'alive'

  initialize(points: Set<Point>, to: Cell) {
    points.forEach(pt => this.current.set(pt, to))
    console.log('cell init')
  }

  randomize(p: number) {
    this.inspect(pt => this.current.set(pt, rnd(100) < p ? 'alive' : 'dead'))
  }

  getCurrent(pt: Point) {
    if (this.always.has(pt)) return 'alive'
    if (this.never.has(pt)) return 'dead'
    return this.current.get(pt) ?? this.edge(pt)
  }

  setNext(pt: Point, state: Cell) {
    if (!this.always.has(pt) && !this.never.has(pt)) this.next.set(pt, state)
  }

  inspect(callback: (pt: Point, cell: Cell) => unknown) {
    for (const [pt] of this.current) {
      callback(pt, this.getCurrent(pt))
    }
  }

  generation(survive: number, birth: number) {
    this.inspect((pt, cell) => {
      if (cell === 'alive' && this.neighbours(pt, survive)) {
        this.setNext(pt, 'alive')
      } else if (cell === 'dead' && this.neighbours(pt, birth)) {
        this.setNext(pt, 'alive')
      } else {
        this.setNext(pt, 'dead')
      }
    })
    this.current = this.next
    this.next = new Map<Point, Cell>()
  }

  neighbours(pt: Point, n: number) {
    let count = 0
    for (const npt of pt.neighbours8()) {
      if (this.getCurrent(npt) === 'alive') count++
      if (count >= n) {
        return true
      }
    }
    return false
  }

  // alive(callback: (pt: Point) => unknown) {

  // }
}
