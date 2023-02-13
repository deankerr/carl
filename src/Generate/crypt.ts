import { CONFIG } from '../config'
import { Region } from '../Core'
import { Overseer2 } from './Overseer2'
import { Rect } from '../Model/Rectangle'
import { pick } from '../lib/util'
import { BSP } from './modules'
import { Room, findAdjacent, connectRooms } from './modules/Room'
import { Overseer3 } from './Overseer3'

export function crypt(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height)
  const O3 = new Overseer3(region)

  region.name = 'crypt'

  const wall = 'cryptWall'
  const floor = 'stoneTileFloor'

  const drawRoom = (rect: Rect) => {
    rect.scale(1).traverse((pt, edge) => region.create(pt, edge ? wall : floor))
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
    region.create(pt, floor)
    region.create(pt, pick(['woodenDoor', 'stoneDoor', 'jailDoor', 'redDoor']))
    O3.snap('Connect Room')
  })

  O3.finalize()
  return region
}
