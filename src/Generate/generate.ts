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

export function dungeon4(loadLevel?: Dungeon4Data) {
  const { useTileset, levelWidthText, levelHeightText, levelWidthTileset, levelHeightTileset } = CONFIG
  const data =
    loadLevel ?? useTileset
      ? create({
          width: levelWidthTileset,
          height: levelHeightTileset,
          minRoomW: 5,
          maxRoomW: 9,
          minRoomH: 5,
          maxRoomH: 9,
        })
      : create({ width: levelWidthText, height: levelHeightText })
  if (!data) throw new Error('Dungeon gen failed.')
  const [terrainData, rooms] = data
  const doors = data[2].map(d => Pt(d.x, d.y))
  return { terrain: Grid.from(terrainData), rooms, doors }
}
