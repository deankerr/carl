import { CONFIG } from '../config'
import { Region } from '../Core'
import { Overseer2 } from './Overseer2'
import { Rect } from '../Model/Rectangle'
import { pick } from '../lib/util'
import { BSP } from './modules'
import { Room, findAdjacent, connectRooms } from './modules/Room'

export function crypt(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'crypt'

  const wall = 'cryptWall'
  const floor = 'stoneTileFloor'

  const drawRoom = (rect: Rect) => {
    rect.scale(1).traverse((pt, edge) => O2.terrain(pt, edge ? wall : floor))
  }

  const bsp = new BSP(region.rect.scale(-1))
  bsp.run(
    6,
    rect => drawRoom(rect),
    i => O2.snapshot('BSP ' + i)
  )

  // create rooms from BSP leaves
  const rooms: Room[] = []
  bsp.leafRects(rect => rooms.push(new Room(rect)))

  // find adjacent room points
  findAdjacent(rooms, region)

  // create doors
  connectRooms(rooms, pt => {
    O2.terrain(pt, floor)
    O2.feature(pt, pick(['woodenDoor', 'stoneDoor', 'jailDoor', 'redDoor']))
    O2.snapshot('Connect Room')
  })

  O2.finalize()
  return region
}
