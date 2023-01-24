import { repeat, rnd } from '../../lib/util'
import { Pt } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'
import { Features } from '../../Templates'
import { Overseer } from '../Overseer'

type BSPConfig = {
  O?: Overseer
  attempts?: number
  minToSplitSize?: number
  minResultSize?: number
}

const BSPConfigDefault = {
  minToSplitSize: 5,
  minResultSize: 3,
}

export function BSPRooms(startRect: Rect, BSPConfig?: BSPConfig) {
  const config = { ...BSPConfigDefault, ...BSPConfig }
  const { minResultSize, O } = config
  const attempts = config.attempts ?? rnd(3, 6)

  const queue = [startRect]
  const complete: Rect[] = []
  const walls: Rect[] = []

  repeat(attempts, () => {
    const r = queue.shift()
    if (!r) {
      console.log('BSP: Queue empty!')
      return true
    }

    const canSplitV = r.width >= config.minToSplitSize
    const canSplitH = r.height >= config.minToSplitSize

    let dir = rnd(1) ? 'vert' : 'hori'
    if (!canSplitV && !canSplitH) {
      complete.push(r)
      return
    }

    if (canSplitV && canSplitH) dir = rnd(1) ? 'vert' : 'hori'
    else if (canSplitV) dir = 'vert'
    else dir = 'hori'

    // choose bisect point along top or left edge
    const split =
      dir === 'vert' ? rnd(r.x + minResultSize, r.x2 - minResultSize) : rnd(r.y + minResultSize, r.y2 - minResultSize)

    //create two sub rects, and a border rect
    const sub1 =
      dir === 'vert' ? Rect.atxy2(Pt(r.x, r.y), Pt(split - 1, r.y2)) : Rect.atxy2(Pt(r.x, r.y), Pt(r.x2, split - 1))

    const sub2 =
      dir === 'vert' ? Rect.atxy2(Pt(split + 1, r.y), Pt(r.x2, r.y2)) : Rect.atxy2(Pt(r.x, split + 1), Pt(r.x2, r.y2))

    const subW = dir === 'vert' ? Rect.at(Pt(split, r.y), 1, r.height) : Rect.at(Pt(r.x, split), r.width, 1)

    queue.push(sub1, sub2)
    walls.push(subW)

    const mut = O?.mutate()
    if (mut) [sub1, sub2].forEach(s => s.traverse(pt => mut.set(pt, Features.debugMarker)))
    return false
  })

  const results = [...queue, ...complete]
  console.log(`BSP: created ${results.length} rooms`, results, 'Walls', walls)

  const wallMut = O?.mutate()
  if (wallMut) walls.forEach(w => w.traverse(pt => wallMut.set(pt, Features.debugMarker)))

  return [[...queue, ...complete], walls]
}
