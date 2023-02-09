import { half, rnd } from '../../lib/util'
import { point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'

class Sector {
  child1: Sector | undefined
  child2: Sector | undefined
  constructor(readonly rect: Rect) {}

  splitVertical() {
    const r = this.rect
    console.log('split V - ratio', r.width / r.height)

    const split = r.x + half(r.width)
    const r1 = Rect.atxy2(point(r.x, r.y), point(split - 1, r.y2))
    const r2 = Rect.atxy2(point(split + 1, r.y), point(r.x2, r.y2))

    this.child1 = new Sector(r1)
    this.child2 = new Sector(r2)
    return [this.child1, this.child2]
  }

  splitHorizontal() {
    const r = this.rect
    console.log('split H - ratio', r.width / r.height)

    const split = r.y + half(r.height)
    const r1 = Rect.atxy2(point(r.x, r.y), point(r.x2, split - 1))
    const r2 = Rect.atxy2(point(r.x, split + 1), point(r.x2, r.y2))

    this.child1 = new Sector(r1)
    this.child2 = new Sector(r2)
    return [this.child1, this.child2]
  }
}

export class BSP {
  root: Sector
  queue: Sector[] = []
  constructor(readonly initialRect: Rect) {
    this.root = new Sector(initialRect)
    this.queue.push(this.root)
  }

  go() {
    const next = this.queue.shift()
    if (!next) return
    console.log('next:', next)
    const [s1, s2] = rnd(1) ? next.splitVertical() : next.splitHorizontal()
    this.queue.push(s1, s2)
    console.log('queue:', this.queue)
  }
}
