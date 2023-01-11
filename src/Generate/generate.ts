/* generate - handles the level generator(s), returning only what we need
 might be unnecessary but I hated how much level data specific typing ended
 up in the main game functions

 later, something like: function generateLevel(Enum.Dungeon) {} ?
 */
// const max = 5
import { Grid } from '../Model/Grid'
import { create } from './dungeon4/'
import { Point, Pt } from '../Model/Point'
import { CONFIG } from '../config'
import { Room } from './dungeon4/dungeon4'
import { half } from '../util/util'
import { Level } from '../Model/Level'
import { templates } from '../Core/Entity'

const { levelWidthTileset, levelHeightTileset } = CONFIG

// export function dungeon4(loadLevel?: Dungeon4Data) {
//   const data =
//     loadLevel ??
//     create({
//       width: levelWidthTileset,
//       height: levelHeightTileset,
//       minRoomW: 5,
//       maxRoomW: 9,
//       minRoomH: 5,
//       maxRoomH: 9,
//     })
//   if (!data) throw new Error('Dungeon gen failed.')
//   const [terrainData, rooms] = data
//   const doors = data[2].map(d => Pt(d.x, d.y))
//   return { terrain: Grid.from(terrainData), rooms, doors }
// }
export type EntityTemplate = [keyof typeof templates, Point]
export type NewLevelWithEntities = [Level, EntityTemplate[]]

export const dungeon4 = (): NewLevelWithEntities => {
  const data = create({
    width: levelWidthTileset,
    height: levelHeightTileset,
    minRoomW: 5,
    maxRoomW: 9,
    minRoomH: 5,
    maxRoomH: 9,
  })

  const terrainGrid = Grid.from(data[0])
  const voidDecor = new Map()
  // map rooms to arrays of (new style) Points
  const rooms = data[1].map(r => r.rect.toPts().map(pt => Pt(pt.x, pt.y)))
  // const entities = data[2].map(pt => templates.door(Pt(pt.x, pt.y)))

  // const eTemplates = [['door', Pt(1, 1)]]
  const entityTemplates: EntityTemplate[] = data[2].map(pt => ['door', Pt(pt.x, pt.y)])

  const label = 'dungeon4'

  return [new Level(label, terrainGrid, voidDecor, rooms), entityTemplates]
}

export const bigRoom = () => {
  const terrain = Grid.fill(levelWidthTileset, levelHeightTileset, 0)
  return {
    terrain,
    rooms: [Room.scaled(half(levelWidthTileset), half(levelHeightTileset), 1, 1)],
    entities: [],
    label: 'big room',
  }
}
