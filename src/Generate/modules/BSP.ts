import { half, pick, range, rnd } from '../../lib/util'
import { point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'

class BinaryRect {
  leaf1: BinaryRect | undefined
  leaf2: BinaryRect | undefined

  constructor(readonly rect: Rect, readonly minWidth: number, readonly minHeight: number) {
    const r = this.rect
  }

  splitVertical(at: number) {
    const r = this.rect
    const split = r.x + at

    const r1 = Rect.atxy2(point(r.x, r.y), point(split - 1, r.y2))
    const r2 = Rect.atxy2(point(split + 1, r.y), point(r.x2, r.y2))

    this.leaf1 = new BinaryRect(r1, this.minWidth, this.minHeight)
    this.leaf2 = new BinaryRect(r2, this.minWidth, this.minHeight)
    return [this.leaf1, this.leaf2] as [BinaryRect, BinaryRect]
  }

  splitHorizontal(at: number) {
    const r = this.rect
    const split = r.y + at

    const r1 = Rect.atxy2(point(r.x, r.y), point(r.x2, split - 1))
    const r2 = Rect.atxy2(point(r.x, split + 1), point(r.x2, r.y2))

    this.leaf1 = new BinaryRect(r1, this.minWidth, this.minHeight)
    this.leaf2 = new BinaryRect(r2, this.minWidth, this.minHeight)
    return [this.leaf1, this.leaf2] as [BinaryRect, BinaryRect]
  }
}

export class BSP {
  minWidth = 6
  minHeight = 4
  maxRatio = 2

  root: BinaryRect
  queue: BinaryRect[] = []
  constructor(readonly initialRect: Rect) {
    this.root = new BinaryRect(initialRect, this.minWidth, this.minHeight)
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

    let result: [BinaryRect, BinaryRect] | undefined
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
      this.leafRects(then)
      after(i)
    }
  }

  leafRects(callback: LeafFn) {
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
}

type LeafFn = (rect: Rect) => unknown
