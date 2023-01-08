/* generate - handles the level generator(s), returning only what we need
 might be unnecessary but I hated how much level data specific typing ended
 up in the main game functions

 later, something like: function generateLevel(Enum.Dungeon) {} ?
 */
// const max = 5
import { Grid } from '../Model/Grid'
import { create } from './dungeon4/'
import { Dungeon4Data } from './dungeon4/dungeon4'
import { Pt } from '../Model/Point'
import { CONFIG } from '../config'
import { Room } from './dungeon4/dungeon4'
import { half } from '../util/util'

const { levelWidthTileset, levelHeightTileset } = CONFIG

export function dungeon4(loadLevel?: Dungeon4Data) {
  const data =
    loadLevel ??
    create({
      width: levelWidthTileset,
      height: levelHeightTileset,
      minRoomW: 5,
      maxRoomW: 9,
      minRoomH: 5,
      maxRoomH: 9,
    })
  if (!data) throw new Error('Dungeon gen failed.')
  const [terrainData, rooms] = data
  const doors = data[2].map(d => Pt(d.x, d.y))
  return { terrain: Grid.from(terrainData), rooms, doors }
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
