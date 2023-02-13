import { half, pick, range, rnd } from '../../lib/util'
import { point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'

class BinaryRect {
  leaf1: BinaryRect | undefined
  leaf2: BinaryRect | undefined

  constructor(readonly rect: Rect) {
    const r = this.rect
  }

  splitVertical(at?: number, size = 1) {
    const r = this.rect
    const split = r.x + (at ?? half(r.width))

    const r1 = Rect.atxy2(point(r.x, r.y), point(split - size, r.y2))
    const r2 = Rect.atxy2(point(split + size, r.y), point(r.x2, r.y2))
    const remainder = Rect.atxy2(point(r1.x2 + 1, r.y), point(r2.x - 1, r.y2))

    this.leaf1 = new BinaryRect(r1)
    this.leaf2 = new BinaryRect(r2)
    return [this.leaf1, this.leaf2, remainder] as [BinaryRect, BinaryRect, Rect]
  }

  splitHorizontal(at?: number, size = 1) {
    const r = this.rect
    const split = r.y + (at ?? half(r.height))

    const r1 = Rect.atxy2(point(r.x, r.y), point(r.x2, split - size))
    const r2 = Rect.atxy2(point(r.x, split + size), point(r.x2, r.y2))
    const remainder = Rect.atxy2(point(r.x, r1.y2 + 1), point(r.x2, r2.y - 1))

    this.leaf1 = new BinaryRect(r1)
    this.leaf2 = new BinaryRect(r2)
    return [this.leaf1, this.leaf2, remainder] as [BinaryRect, BinaryRect, Rect]
  }
}

export class BSP {
  minWidth = 6
  minHeight = 4
  maxRatio = 2

  root: BinaryRect
  queue: BinaryRect[] = []
  remaining: Rect[] = []

  constructor(readonly initialRect: Rect) {
    this.root = new BinaryRect(initialRect)
    this.queue.push(this.root)
  }

  split() {
    const next = this.queue.shift()
    if (!next) return false

    const r = next.rect

    // Find all possible split points
    // vertical
    const vAvail: number[] = []
    for (const i of range(1, r.width - 1)) {
      const ratio1 = r.height / i
      const ratio2 = r.height / (r.width - i)
      if (
        ratio1 <= this.maxRatio &&
        ratio2 <= this.maxRatio &&
        i >= this.minWidth &&
        r.width - i >= this.minWidth
      )
        vAvail.push(i)
    }

    // horizontal
    const hAvail: number[] = []
    for (const i of range(1, r.height - 1)) {
      const ratio1 = r.width / i
      const ratio2 = r.width / (r.height - i)
      if (
        ratio1 <= this.maxRatio &&
        ratio2 <= this.maxRatio &&
        i >= this.minHeight &&
        r.height - i >= this.minHeight
      )
        hAvail.push(i)
    }

    const v = vAvail.length > 0 ? pick(vAvail) : 0
    const h = hAvail.length > 0 ? pick(hAvail) : 0

    let result: [BinaryRect, BinaryRect, Rect] | undefined
    if (v && h) {
      rnd(1) ? (result = next.splitVertical(v)) : (result = next.splitHorizontal(h))
    } else if (v) result = next.splitVertical(v)
    else if (h) result = next.splitHorizontal(h)

    if (!result) {
      console.warn('Failed to split', this)
      return false
    }

    const [child1, child2] = result
    this.queue.push(child1, child2)
    return true
  }

  splitNextVertical(at: number) {
    const next = this.queue.shift()
    if (!next) return

    const [leaf1, leaf2] = next.splitVertical(half(next.rect.width) + (rnd(1) ? at : -at))
    this.queue.push(leaf1, leaf2)
  }

  splitNextHorizontal(at: number) {
    const next = this.queue.shift()
    if (!next) return

    const [leaf1, leaf2] = next.splitHorizontal(half(next.rect.width) + (rnd(1) ? at : -at))
    this.queue.push(leaf1, leaf2)
  }

  trisectLargest(dir: 'vertical' | 'horizontal' | 'largest', variance: number, size: number) {
    const [largest] = [...this.queue].sort((a, b) => b.rect.area - a.rect.area)
    const { rect } = largest

    let leaves: [BinaryRect, BinaryRect, Rect] | undefined
    if (dir === 'vertical' || (dir === 'largest' && rect.width >= rect.height)) {
      const at = half(rect.width) + (rnd(1) ? variance : -variance)
      leaves = largest.splitVertical(at, size)
    } else {
      const at = half(rect.height) + (rnd(1) ? variance : -variance)
      leaves = largest.splitHorizontal(at, size)
    }

    if (!leaves) throw new Error('BSP: failed to split largest')
    this.queue = this.queue.filter(r => r !== largest)

    const [leaf1, leaf2, remainder] = leaves
    this.queue.push(leaf1, leaf2)
    this.remaining.push(remainder)
    return remainder
  }

  run(iterations: number, then: LeafFn, after: (i: number) => unknown) {
    let i = 0
    console.log('iterations:', iterations)
    while (i++ < iterations) {
      const success = this.split()
      if (success) {
        this.leaves(then)
        after(i)
      }
    }
  }

  leaves(callback: LeafFn) {
    function climb(s: BinaryRect) {
      if (s.leaf1 && s.leaf2) {
        climb(s.leaf1)
        climb(s.leaf2)
      } else {
        callback(s.rect)
      }
    }

    climb(this.root)
  }

  remainders(callback: LeafFn) {
    this.remaining.forEach(rect => callback(rect))
  }
}

type LeafFn = (rect: Rect) => unknown
