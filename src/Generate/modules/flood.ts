import { Point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'

// export function* floodWalkable(startPt: Point, O2: O2Module) {
//   const { region } = O2
//   const queue = new Queue<Point>(startPt)
//   const checked = new Set<Point>()
//   const nextRing = new Set<Point>()

//   while (queue.queue.length > 0) {
//     const pt = queue.next()
//     if (!pt) return startPt

//     checked.add(pt)

//     if (!region.terrainAt(pt).blocksMovement) {
//       yield pt

//       pt.neighbours8().forEach(npt => {
//         if (!checked.has(npt) && !queue.queue.includes(npt)) {
//           nextRing.add(npt)
//         }
//       })
//     }

//     if (queue.queue.length < 1) {
//       queue.queue = shuffle([...nextRing])
//       nextRing.clear()
//     }
//   }
//   return startPt
// }

// export function rndCluster(amount: number, O2: O2Module) {
//   const flood = floodWalkable(O2.region.rndWalkable(), O2)
//   const results: Point[] = []
//   loop(amount, () => {
//     results.push(flood.next().value)
//   })
//   return results
// }

export function floodFindRegions(rect: Rect, predicate: (pt: Point) => boolean) {
  let count = 0
  const regions = new Map<Point, number>()
  let neighbours: Point[] = []
  rect.traverse(pt => {
    if (!regions.has(pt)) {
      if (predicate(pt)) {
        count++
        regions.set(pt, count)
        neighbours = []

        pt.neighbours8().forEach(npt => {
          if (!regions.has(npt)) neighbours.push(npt)
        })

        while (neighbours.length > 0) {
          const npt = neighbours.pop()
          if (!npt) return
          if (predicate(npt)) {
            regions.set(npt, count)
            npt.neighbours8().forEach(nnpt => {
              if (!regions.has(nnpt)) neighbours.push(nnpt)
            })
          } else regions.set(npt, -1)
        }
      } else regions.set(pt, -1)
    }
  })

  logPointMap(rect, regions)

  const rCount: Record<number, number> = {}
  for (const [pt, v] of regions) {
    if (v === -1) continue
    if (rCount[v] !== undefined) rCount[v]++
    else rCount[v] = 1
  }
  console.log('rCount:', rCount)

  console.log('count:', count)
  return regions
}

function logPointMap(rect: Rect, map: Map<Point, number>) {
  let row = 0
  let line = ''
  rect.traverse(pt => {
    if (pt.y !== row) {
      console.log(row < 10 ? ' ' + row : '' + row, line)
      row = pt.y
      line = ''
    }
    const n = `${map.get(pt) ?? '?'}`
    line += n === '-1' ? 'x' : n
  })
  console.log('' + row, line)
}
