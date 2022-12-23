import { CONFIG } from './config'
import { Dungeon4Data } from './game'

import { Level, SeenMap, TerrainMap } from './Level'
import { qCreatePlayer, Entity } from './entity'
import { Position } from './components'

export interface World {
  activeLevel: Level
  player: Entity
  levels: Level[]
  // newMap: () => Level
  // changeLevel: (to: number) => void
  getActive: () => Level
  movePlayerPos: () => void
}

export let activeLevel: Level

export function World(d4data: Dungeon4Data): World {
  // const globalEntities ???
  // let activeLevel: Level

  const levels: Level[] = []

  const levelWidth = CONFIG.levelWidth // shouldnt need to tell level this
  const levelHeight = CONFIG.levelHeight
  const terrainMap: TerrainMap = {}
  const seen: SeenMap = {}

  const [terrain, doorPts] = d4data
  terrain.forEach((row, iy) =>
    row.forEach((t, ix) => {
      terrainMap[`${ix}-${iy}`] = t
      seen[`${ix}-${iy}`] = false
    })
  )

  console.log('doorPts:', doorPts)
  console.log(doorPts.flat())
  const doorsAt = doorPts.flat().map((pt) => [pt.x, pt.y])
  console.log(doorsAt)

  // const doorsAt: number[][] = []
  // dungeon1.get((x, y, content) => {
  //   if (content == 3) doorsAt.push([x, y])
  //   terrainMap[`${x}-${y}`] = content == 3 ? 0 : content
  //   seen[`${x}-${y}`] = false
  // })

  // const gen = new Dungeon1(1, 1, [])

  activeLevel = Level({ terrainMap, seen, levelWidth, levelHeight, subtype: '', doorsAt })

  const player = qCreatePlayer(activeLevel.getRandomWalkable())
  activeLevel.add(player)

  return { activeLevel, player, levels, getActive, movePlayerPos: newPlayerPos }

  function getActive() {
    return activeLevel
  }

  // function newMap() {
  //   const gen = activeLevel.gen
  //   const index = levels.findIndex((e) => e === activeLevel)
  //   activeLevel.remove(player)

  //   // this all should be more generic
  //   let newLevelData: {
  //     terrainMap: TerrainMap
  //     seen: SeenMap
  //     levelWidth: number
  //     levelHeight: number
  //     gen: GenTypes
  //     subtype: string
  //   }

  //   if (activeLevel.levelData.subtype === 'cell2') newLevelData = cellular2()
  //   else if (gen instanceof Cellular) newLevelData = cellular()
  //   else if (gen instanceof CellularFixed) newLevelData = cellularFixed()
  //   else if (gen instanceof Arena) newLevelData = arena()
  //   else if (gen instanceof Digger) newLevelData = digger()
  //   else if (gen instanceof DividedMaze) newLevelData = divMaze()
  //   else if (gen instanceof IceyMaze) newLevelData = iceyMaze()
  //   else if (gen instanceof EllerMaze) newLevelData = ellerMaze()
  //   else if (gen instanceof Uniform) newLevelData = uniform()
  //   else if (gen instanceof Rogue) newLevelData = rogue()
  //   else throw new Error('newMap: unknown gen instance ' + activeLevel.gen.constructor.name)

  //   const newLevel = Level(newLevelData)
  //   levels[index] = newLevel
  //   activeLevel = newLevel

  //   activeLevel.add(player)
  //   return activeLevel
  // }

  // function changeLevel(to: number) {
  //   if (levels[to]) {
  //     activeLevel.remove(player)
  //     activeLevel = levels[to]
  //     activeLevel.add(player)
  //     console.log(
  //       'new activeLevel:',
  //       activeLevel.levelID,
  //       activeLevel.gen.constructor.name,
  //       activeLevel.levelData.subtype
  //     )
  //     return activeLevel
  //   }

  //   throw new Error(`${to} is not a level`)
  // }

  function newPlayerPos() {
    const pos = player.get(Position)
    const { x, y } = activeLevel.getRandomWalkable()
    pos.x = x
    pos.y = y
  }
}
