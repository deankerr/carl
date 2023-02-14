import { half, pick, range, rnd } from '../../lib/util'
import { point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'

class BinaryRect {
  leaf1: BinaryRect | undefined
  leaf2: BinaryRect | undefined

  constructor(readonly rect: Rect) {
    const r = this.rect
  }

  splitVertical(at: number, size = 0) {
    const r = this.rect
    const split = r.x + at

    const r1 = Rect.atxy2(point(r.x, r.y), point(split - size, r.y2))
    const r2 = Rect.atxy2(point(split + size, r.y), point(r.x2, r.y2))
    const remainder = Rect.atxy2(point(r1.x2 + 1, r.y), point(r2.x - 1, r.y2))

    this.leaf1 = new BinaryRect(r1)
    this.leaf2 = new BinaryRect(r2)
    console.log('Vertical', 'at', at, 'split', split, 'r1:', r1, 'r2:', r2, 'rr:', remainder)
    return [this.leaf1, this.leaf2, remainder] as [BinaryRect, BinaryRect, Rect]
  }

  splitHorizontal(at: number, size = 0) {
    const r = this.rect
    const split = r.y + at

    const r1 = Rect.atxy2(point(r.x, r.y), point(r.x2, split - size))
    const r2 = Rect.atxy2(point(r.x, split + size), point(r.x2, r.y2))
    const remainder = Rect.atxy2(point(r.x, r1.y2 + 1), point(r.x2, r2.y - 1))

    this.leaf1 = new BinaryRect(r1)
    this.leaf2 = new BinaryRect(r2)
    console.log('Horizontal', 'at', at, 'split', split, 'r1:', r1, 'r2:', r2, 'rr:', remainder)
    return [this.leaf1, this.leaf2, remainder] as [BinaryRect, BinaryRect, Rect]
  }
}

export class BinarySpacePartition {
  minWidth = 6
  minHeight = 4
  maxRatio = 3

  root: BinaryRect
  queue: BinaryRect[] = []
  remaining: Rect[] = []

  dbCount = 0

  constructor(readonly initialRect: Rect) {
    initialRect.id = this.dbCount++
    this.root = new BinaryRect(initialRect)
    this.queue.push(this.root)
  }

  split() {
    const next = this.queue.shift()
    if (!next) return false

    const r = next.rect
    console.group('Assess', r, 'r.width - 1:', r.width - 1)
    // Find all possible split points
    // vertical
    const vAvail: number[] = []
    const vS = [rdb(r.id, r.id, r.id, r.id, false, false)]
    for (const i of range(1, r.width - 1)) {
      const ratio1 = i / r.height
      const ratio2 = (r.width - i) / r.height
      const ratios = ratio1 <= this.maxRatio && ratio2 <= this.maxRatio
      const widths = i >= this.minWidth && r.width - i >= this.minWidth
      if (ratios && widths) {
        vAvail.push(i)
      }
      vS.push(rdb(i, ratio1, r.width - i, ratio2, ratios, widths))
    }

    // horizontal
    const hAvail: number[] = []
    const hS = [rdb(r.id, r.id, r.id, r.id, false, false)]
    for (const i of range(1, r.height - 1)) {
      const ratio1 = r.width / i
      const ratio2 = r.width / (r.height - i)
      const ratios = ratio1 <= this.maxRatio && ratio2 <= this.maxRatio
      const heights = i >= this.minHeight && r.height - i >= this.minHeight
      if (ratios && heights) hAvail.push(i)
      hS.push(rdb(i, ratio1, r.height - i, ratio2, ratios, heights))
    }

    const v = vAvail.length > 0 ? pick(vAvail) : 0
    const h = hAvail.length > 0 ? pick(hAvail) : 0
    console.table(vS)
    console.log('vAvail:', vAvail)
    console.table(hS)
    console.log('hAvail:', hAvail)
    let result: [BinaryRect, BinaryRect, Rect] | undefined
    if (v && h) {
      rnd(1) ? (result = next.splitVertical(v)) : (result = next.splitHorizontal(h))
    } else if (v) result = next.splitVertical(v)
    else if (h) result = next.splitHorizontal(h)
    console.groupEnd()
    if (!result) {
      console.warn('Failed to split', next, hS)
      return false
    }

    const [leaf1, leaf2, remainder] = result
    leaf1.rect.id = this.dbCount++
    leaf2.rect.id = this.dbCount++
    this.queue.push(leaf1, leaf2)
    this.remaining.push(remainder)
    return true
  }

  trisectLargest(
    dir: 'vertical' | 'horizontal' | 'largest',
    variance: number,
    size: number,
    then?: RectFn
  ) {
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

    if (then) then(remainder)
  }

  run(iterations: number, then: RectFn, after: (i: number) => unknown) {
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

  leaves(callback: RectFn) {
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

  remainders(callback: RectFn) {
    this.remaining.forEach(rect => callback(rect))
  }
}

type RectFn = (rect: Rect) => unknown

function rdb(
  size1: number,
  ratio1: number,
  size2: number,
  ratio2: number,
  ratiosOk: boolean,
  sizeOK: boolean
) {
  return { size1, ratio1: ratio1.toFixed(2), size2, ratio2: ratio2.toFixed(2), ratiosOk, sizeOK }
}
