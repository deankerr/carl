import { rnd } from '../../lib/util'
import { Point, pointRect } from '../../Model/Point'
import { O2Module } from '../Overseer2'

export function cellularInit(O2: O2Module, probability = 45) {
  const { region, terrain } = O2

  const wall = terrain('wall')
  const snap = O2.snap('Cellular init')

  const isEdge = (pt: Point) =>
    pt.x === 0 || pt.x === region.width - 1 || pt.y === 0 || pt.y === region.height - 1
  pointRect(0, 0, region.width, region.height, pt => {
    if (isEdge(pt) || rnd(100) < probability) wall(pt)
  })

  snap()
}

export function cellularLife(O2: O2Module, cycle?: number) {
  const { region, terrain } = O2

  const wall = terrain('wall')
  const voidT = terrain('void')
  // const snap = O2.snap('Cellular life step')

  const isWall = (pt: Point) => 'blocksMovement' in region.terrainAt(pt)

  pointRect(0, 0, region.width, region.height, pt => {
    const subject = isWall(pt)
    if (subject) {
      // subject is a wall, 4+ wall neighbours to stay wall
      let count = 0
      for (const neighbour of pt.neighbours8()) {
        if (isWall(neighbour)) count++
      }
      if (count < 4) {
        voidT(pt)
      }
    } else {
      // subject is void, 5+ wall neighbours to become wall
      let count = 0
      for (const neighbour of pt.neighbours8()) {
        if (isWall(neighbour)) count++
      }
      if (count >= 5) wall(pt)
    }
  })
  O2.snap('Cellular life step' + cycle)()
}
