import { CONFIG } from '../config'
import { Region } from '../Core'
import { Rect } from '../Model/Rectangle'
import { pick } from '../lib/util'
import { BSP } from './modules'
import { Room, findAdjacent, connectRooms } from './modules/Room'
import { Overseer3 } from './Overseer3'

export function crypt(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height)
  const O3 = new Overseer3(region, {
    wall: 'cryptWall',
    floor: 'stoneTileFloor',
    door: 'stoneDoor',
  })

  region.name = 'crypt'
  const { wall, floor, door } = O3.theme

  const drawRoom = (rect: Rect) => {
    rect.scale(1).traverse((pt, edge) => {
      // region.create(pt, edge ? wall : floor)
      edge ? O3.wall(pt) : O3.floor(pt)
    })
  }

  const bsp = new BSP(region.rect.scale(-1))
  bsp.run(
    6,
    rect => drawRoom(rect),
    i => O3.snap('BSP ' + i)
  )

  // create rooms from BSP leaves
  const rooms: Room[] = []
  bsp.leafRects(rect => rooms.push(new Room(rect)))

  // find adjacent room points
  findAdjacent(rooms, region)

  // create doors
  connectRooms(rooms, pt => {
    O3.floor(pt)
    O3.door(pt)
    O3.snap('Connect Room')
  })

  O3.finalize()
  return region
}
