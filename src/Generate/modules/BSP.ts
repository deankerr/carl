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
    // console.log('split V', at, this)

    const split = r.x + at
    const r1 = Rect.atxy2(point(r.x, r.y), point(split - 1, r.y2))
    const r2 = Rect.atxy2(point(split + 1, r.y), point(r.x2, r.y2))

    this.child1 = new Sector(r1, this.minWidth, this.minHeight)
    this.child2 = new Sector(r2, this.minWidth, this.minHeight)
    return [this.child1, this.child2]
  }

  splitHorizontal(at: number) {
    const r = this.rect
    // console.log('split H', at, this)

    const split = r.y + at
    const r1 = Rect.atxy2(point(r.x, r.y), point(r.x2, split - 1))
    const r2 = Rect.atxy2(point(r.x, split + 1), point(r.x2, r.y2))

    this.child1 = new Sector(r1, this.minWidth, this.minHeight)
    this.child2 = new Sector(r2, this.minWidth, this.minHeight)
    return [this.child1, this.child2]
  }

  split() {
    const r = this.rect
    // console.log('current:', (r.width / r.height).toFixed(2))
    if (r.area <= 40) {
      console.warn('too small', this)
      return false
    }
    // vertical
    const vAvails: string[] = []
    const vAvail: number[] = []
    for (const i of range(1, r.width - 1)) {
      const ratio1 = r.height / i
      const ratio2 = r.height / (r.width - i)
      if (ratio1 <= 2 && ratio2 <= 2 && i >= this.minWidth && r.width - i >= this.minWidth)
        vAvail.push(i)

      vAvails.push(`${i}: ${ratio1.toFixed(2)} ${ratio2.toFixed(2)}`)
    }
    // console.log('vAvails:', vAvails)
    // console.log('vAvail:', vAvail)

    // horizontal
    const hAvails: string[] = []
    const hAvail: number[] = []
    for (const i of range(1, r.height - 1)) {
      const ratio1 = r.width / i
      const ratio2 = r.width / (r.height - i)
      if (ratio1 <= 2 && ratio2 <= 2 && i >= this.minHeight) hAvail.push(i)

      hAvails.push(`${i}:  ${ratio1.toFixed(2)} ${ratio2.toFixed(2)}`)
    }
    // console.log('hAvails:', hAvails)
    // console.log('hAvail:', hAvail)

    const v = vAvail.length > 0 ? pick(vAvail) : 0
    const h = hAvail.length > 0 ? pick(hAvail) : 0
    // const v = half(r.width)
    // const h = half(r.height)

    if (v && h) {
      rnd(1) ? this.splitVertical(v) : this.splitHorizontal(h)
      return true
    } else if (v) {
      this.splitVertical(v)
      return true
    } else if (h) {
      this.splitHorizontal(h)
      return true
    }
    console.warn('failed to split', this)
    return false
  }
}

// const ratio1 = r.width / (i - 1)
// const ratio2 = r.width / (r.height - i + 1)
export class BSP {
  minWidth = 6
  minHeight = 4
  root: Sector
  queue: Sector[] = []
  constructor(readonly initialRect: Rect) {
    this.root = new Sector(initialRect, this.minWidth, this.minHeight)
    this.queue.push(this.root)
  }

  run(i = 1) {
    const next = this.queue.shift()
    if (!next) return
    // console.log('next:', next)
    next.split()
    if (next.child1 && next.child2) {
      this.queue.push(next.child1, next.child2)
    } else console.log('unable to split', next)

    // console.log('queue:', this.queue)
  }

  leaves(callback: (sector: Sector) => unknown) {
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
