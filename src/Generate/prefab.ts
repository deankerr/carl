import { ruin1 } from './prefab/ruin1'
import { Point, Pt } from '../Model/Point'
import { Grid } from '../Model/Grid'
import { Level } from '../Model/Level'
import { TerrainNumMap, TerrainType } from '../Core/Terrain'
import { NewLevel } from './generate'
import { populateNPCs } from './features'
import { createTemplates, templates } from '../Core/Entity'

export const prefabRuin1 = (): NewLevel => {
  const fakeRooms: Point[][] = []
  let fakeRoomI = 0
  const entities = createTemplates()
  const voidDecor = new Map<string, TerrainType>()

  const terrain: number[][] = ruin1.reduce((acc, row, yi) => {
    const line: number[] = row.split('').map((t, xi) => {
      const here = Pt(xi, yi)
      // create fake rooms for npc generation
      if (t === '.' && ++fakeRoomI >= 30) {
        fakeRooms.push([here])
        fakeRoomI = 0
      }

      // record void decor pt and type, return as path
      if (t === ',' || t === ':') {
        voidDecor.set(here.s, TerrainNumMap[tDict[t]])
      }
      if (tDict[t]) return tDict[t]

      switch (t) {
        case 'v':
          entities.features.push([templates.shrub, here])
          break
        case '+':
          entities.doors.push(here)
          break
        // case '>':
        //   entities.push(templates.player(Pt(xi, yi)))
        //   break
      }
      return 0
    })
    return [...acc, line]
  }, [] as number[][])

  const terrainGrid = Grid.from(terrain)
  const level = new Level('ruins1', terrainGrid, voidDecor, fakeRooms)

  entities.beings = populateNPCs(level)

  return [level, entities]
}

const tDict: { [key: string]: number } = {
  '.': 0,
  '#': 1,
  '[': 2,
  '~': 3,
  ',': 4,
  ':': 9,
  '>': 11,
  ' ': 98,
}
