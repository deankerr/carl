import { point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'
import { half, pick, rnd } from '../../lib/util'

const minResultWidth = 7
const minResultHeight = 5
const maxRatio = 3

export class BinarySpacePartition {
  root: BinaryRect
  rectQueue: BinaryRect[] = []
  rectGaps: BinaryRect[] = []

  rectComplete: BinaryRect[] = []
  rectID: number

  constructor(rect: Rect) {
    this.root = new BinaryRect(rect)
    this.rectQueue.push(this.root)
    this.rectID = rect.id + 1
  }

  splitNext(gap = 0) {
    const next = this.rectQueue.shift()
    if (!next) {
      console.warn('BSP: No more Rects to split')
      return
    }

    const [vAvail, hAvail] = next.findSplitPoints()

    if (vAvail.length === 0 && hAvail.length === 0) {
      this.rectComplete.push(next)
      return
    }

    let dir: 'vertical' | 'horizontal'

    if (vAvail.length > 0 && hAvail.length > 0) {
      dir = rnd(1) ? 'vertical' : 'horizontal'
    } else if (vAvail.length > 0) dir = 'vertical'
    else dir = 'horizontal'

    const [leaf1, leaf2, leafGap] =
      dir === 'vertical'
        ? next.splitVertical(pick(vAvail), gap)
        : next.splitHorizontal(pick(hAvail), gap)

    leaf1.rect.id = this.rectID++
    leaf2.rect.id = this.rectID++

    this.rectQueue.push(leaf1, leaf2)
    this.rectGaps.push(leafGap)
  }

  splitLargest(dir: 'vertical' | 'horizontal' | 'best', variance: number, gap = 0) {
    const [next] = [...this.rectQueue].sort((a, b) => b.rect.area - a.rect.area)
    if (dir === 'best') dir = next.rect.width >= next.rect.height ? 'vertical' : 'horizontal'

    let at: number
    if (dir === 'vertical') at = half(next.rect.width) + (rnd(1) ? variance : -variance)
    else at = half(next.rect.height) + (rnd(1) ? variance : -variance)

    const [leaf1, leaf2, leafGap] =
      dir === 'vertical' ? next.splitVertical(at, gap) : next.splitHorizontal(at, gap)

    leaf1.rect.id = this.rectID++
    leaf2.rect.id = this.rectID++

    this.rectQueue = this.rectQueue.filter(r => r !== next)
    this.rectQueue.push(leaf1, leaf2)
    this.rectGaps.push(leafGap)
  }

  splitN(amount: number) {
    console.log('BSP - split', amount)
    for (let i = 0; i < amount; i++) this.splitNext()
  }

  splitAll() {
    while (this.rectQueue.length > 0) {
      this.splitNext()
    }
  }

  leaves(callback: RectCallback) {
    function climb(bRect: BinaryRect) {
      if (bRect.leaf1 && bRect.leaf2) {
        climb(bRect.leaf1)
        climb(bRect.leaf2)
      } else {
        callback(bRect.rect)
      }
    }

    climb(this.root)
  }
}

type RectCallback = (r: Rect) => unknown

class BinaryRect {
  leaf1: BinaryRect | undefined
  leaf2: BinaryRect | undefined
  leafGap: BinaryRect | undefined

  constructor(readonly rect: Rect) {}

  findSplitPoints() {
    const rect = this.rect
    // assess vertical/width
    const vAvail: number[] = []
    for (let i = minResultWidth; i <= rect.width - minResultWidth; i++) {
      const i2 = rect.width - i

      const ratio1 = rect.height / i
      const ratio2 = rect.height / i2
      if (ratio1 <= maxRatio && ratio2 <= maxRatio) vAvail.push(i)
    }

    // assess horizontal/height
    const hAvail: number[] = []
    for (let i = minResultHeight; i <= rect.height - minResultHeight; i++) {
      const i2 = rect.height - i

      const ratio1 = rect.width / i
      const ratio2 = rect.width / i2
      if (ratio1 <= maxRatio && ratio2 <= maxRatio) hAvail.push(i)
    }

    return [vAvail, hAvail]
  }

  splitVertical(at: number, gap = 0) {
    const rect = this.rect
    if (at < 0 || at > rect.width) throw new Error('Invalid split point')

    const split = rect.x + at

    const r1 = Rect.atxy2(point(rect.x, rect.y), point(split - gap, rect.y2))
    const r2 = Rect.atxy2(point(split + gap, rect.y), point(rect.x2, rect.y2))
    const rg = Rect.atxy2(point(r1.x2 + (gap ? 1 : 0), r1.y), point(r2.x - (gap ? 1 : 0), r2.y2))

    this.leaf1 = new BinaryRect(r1)
    this.leaf2 = new BinaryRect(r2)
    this.leafGap = new BinaryRect(rg)

    return [this.leaf1, this.leaf2, this.leafGap]
  }

  splitHorizontal(at: number, gap = 0) {
    const rect = this.rect
    if (at < 0 || at > rect.height) throw new Error('Invalid split point')

    const split = rect.y + at

    const r1 = Rect.atxy2(point(rect.x, rect.y), point(rect.x2, split - gap))
    const r2 = Rect.atxy2(point(rect.x, split + gap), point(rect.x2, rect.y2))
    const rg = Rect.atxy2(point(r1.x, r1.y2 + (gap ? 1 : 0)), point(r2.x2, r2.y - (gap ? 1 : 0)))

    this.leaf1 = new BinaryRect(r1)
    this.leaf2 = new BinaryRect(r2)
    this.leafGap = new BinaryRect(rg)

    return [this.leaf1, this.leaf2, this.leafGap]
  }
}

// console.log('V',i,ratio1.toFixed(2),ratio1 <= maxRatio,'|',i2,ratio2.toFixed(2),ratio2 <= maxRatio)
