import { ruin1 } from './prefab/ruin1'
import { Entity, templates } from '../Core/Entity'
import { Point, Pt } from '../Model/Point'
import { Grid } from '../Model/Grid'
import { Room } from './dungeon4/dungeon4'

export const prefabRuin1 = () => {
  const fakeRooms: Room[] = []
  let fakeRoomI = 0
  const entities: Entity[] = []
  const voidDecor: Point[] = []

  const terrain: number[][] = ruin1.reduce((acc, row, yi) => {
    const line: number[] = row.split('').map((t, xi) => {
      // create fake rooms for npc generation
      if (t === '.' && ++fakeRoomI >= 30) {
        fakeRooms.push(Room.scaled(xi, yi, 1, 1))
        fakeRoomI = 0
      }

      // record pts to reveal through walls
      if (t === ',' || t === ':') {
        voidDecor.push(Pt(xi, yi))
      }

      if (tDict[t]) return tDict[t]

      switch (t) {
        case 'v':
          entities.push(templates.shrub(Pt(xi, yi)))
          break
        case '+':
          entities.push(templates.door(Pt(xi, yi)))
          break
        // case '>':
        //   entities.push(templates.player(Pt(xi, yi)))
        //   break
      }
      return 0
    })
    return [...acc, line]
  }, [] as number[][])

  const result = { label: 'ruins1', terrain: Grid.from(terrain), entities, rooms: fakeRooms, voidDecor }
  // console.log('prefab:', result)
  return result
}

const tDict: { [key: string]: number } = {
  '.': 0,
  '#': 1,
  '[': 2,
  '~': 3,
  ',': 4,
  ':': 9,
  ' ': 10,
}
