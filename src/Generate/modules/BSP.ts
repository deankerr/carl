import { half, pick, range, rnd } from '../../lib/util'
import { point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'

export class Sector {
  child1: Sector | undefined
  child2: Sector | undefined

  constructor(readonly rect: Rect, readonly minWidth: number, readonly minHeight: number) {
    const r = this.rect
  }

  splitVertical(at: number) {
    const r = this.rect
    const split = r.x + at

    const r1 = Rect.atxy2(point(r.x, r.y), point(split - 1, r.y2))
    const r2 = Rect.atxy2(point(split + 1, r.y), point(r.x2, r.y2))

    this.child1 = new Sector(r1, this.minWidth, this.minHeight)
    this.child2 = new Sector(r2, this.minWidth, this.minHeight)
    return [this.child1, this.child2] as [Sector, Sector]
  }

  splitHorizontal(at: number) {
    const r = this.rect
    const split = r.y + at

    const r1 = Rect.atxy2(point(r.x, r.y), point(r.x2, split - 1))
    const r2 = Rect.atxy2(point(r.x, split + 1), point(r.x2, r.y2))

    this.child1 = new Sector(r1, this.minWidth, this.minHeight)
    this.child2 = new Sector(r2, this.minWidth, this.minHeight)
    return [this.child1, this.child2] as [Sector, Sector]
  }
}

export class BSP {
  minWidth = 6
  minHeight = 4
  root: Sector
  queue: Sector[] = []
  constructor(readonly initialRect: Rect) {
    this.root = new Sector(initialRect, this.minWidth, this.minHeight)
    this.queue.push(this.root)
  }

  split() {
    const next = this.queue.shift()
    if (!next) return

    const r = next.rect

    // Find all possible split points
    // vertical
    const vAvail: number[] = []
    for (const i of range(1, r.width - 1)) {
      const ratio1 = r.height / i
      const ratio2 = r.height / (r.width - i)
      if (ratio1 <= 2 && ratio2 <= 2 && i >= this.minWidth && r.width - i >= this.minWidth)
        vAvail.push(i)
    }

    // horizontal
    const hAvail: number[] = []
    for (const i of range(1, r.height - 1)) {
      const ratio1 = r.width / i
      const ratio2 = r.width / (r.height - i)
      if (ratio1 <= 2 && ratio2 <= 2 && i >= this.minHeight && r.height - i >= this.minHeight)
        hAvail.push(i)
    }

    const v = vAvail.length > 0 ? pick(vAvail) : 0
    const h = hAvail.length > 0 ? pick(hAvail) : 0

    let result: [Sector, Sector] | undefined
    if (v && h) {
      rnd(1) ? (result = next.splitVertical(v)) : (result = next.splitHorizontal(h))
    } else if (v) result = next.splitVertical(v)
    else if (h) result = next.splitHorizontal(h)

    if (!result) {
      console.warn('Failed to split', this)
      return
    }

    const [child1, child2] = result
    this.queue.push(child1, child2)
  }

  run(iterations: number, then: LeafFn, after: (i: number) => unknown) {
    let i = 0
    while (i++ <= iterations) {
      this.split()
      this.leaves(then)
      after(i)
    }
  }

  leaves(callback: LeafFn) {
    function climb(s: Sector) {
      if (s.child1 && s.child2) {
        climb(s.child1)
        climb(s.child2)
      } else {
        callback(s)
      }
    }

    climb(this.root)
  }
}

type LeafFn = (sector: Sector) => unknown
