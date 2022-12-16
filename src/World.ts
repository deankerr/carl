import { Level, SeenMap, TerrainMap } from './Level'
import {
  arena,
  cellular,
  digger,
  cellularFixed,
  GenTypes,
  cellular2,
  iceyMaze,
  divMaze,
  ellerMaze,
  uniform,
  rogue,
} from './generate'

import { qCreatePlayer, Entity } from './entity'
import Arena from 'rot-js/lib/map/arena'
import Cellular from 'rot-js/lib/map/cellular'
import Digger from 'rot-js/lib/map/digger'
import CellularFixed from './util/cellular'
import DividedMaze from 'rot-js/lib/map/dividedmaze'
import IceyMaze from 'rot-js/lib/map/iceymaze'
import EllerMaze from 'rot-js/lib/map/ellermaze'
import Rogue from 'rot-js/lib/map/rogue'
import Uniform from 'rot-js/lib/map/uniform'
import { Position } from './components'
import { Dungeon1 } from './generate/Dungeon1'
import { CONFIG } from './config'

export interface World {
  activeLevel: Level
  player: Entity
  levels: Level[]
  newMap: () => Level
  changeLevel: (to: number) => void
  getActive: () => Level
  movePlayerPos: () => void
}

export let activeLevel: Level

export function World(dungeon1: Dungeon1): World {
  // const globalEntities ???
  // let activeLevel: Level
  const levels: Level[] = []

  const levelWidth = CONFIG.levelW // shouldnt need to tell level this
  const levelHeight = CONFIG.levelH
  const terrainMap: TerrainMap = {}
  const seen: SeenMap = {}

  const doorsAt: number[][] = []
  dungeon1.get((x, y, content) => {
    if (content == 3) doorsAt.push([x, y])
    terrainMap[`${x}-${y}`] = content == 3 ? 0 : content
    seen[`${x}-${y}`] = false
  })

  const gen = new Dungeon1(1, 1, [])

  activeLevel = Level({ terrainMap, seen, levelWidth, levelHeight, gen, subtype: '', doorsAt })
  // const cellFixedData = cellularFixed()
  // const cellFixedLevel = Level(cellFixedData)

  // const cellularData = cellular()
  // const cellularLevel = Level(cellularData)

  // const diggerData = digger()
  // const diggerLevel = Level(diggerData)

  // const arenaData = arena()
  // const arenaLevel = Level(arenaData)

  // const cell2d = cellular2()
  // const cell2lev = Level(cell2d)

  // levels.push(
  //   cellularLevel,
  //   cellFixedLevel,
  //   cell2lev,
  //   diggerLevel,
  //   arenaLevel,
  //   Level(divMaze()),
  //   Level(iceyMaze()),
  //   Level(ellerMaze()),
  //   Level(uniform()),
  //   Level(rogue())
  // )
  // activeLevel = levels[0]

  const player = qCreatePlayer(activeLevel.getRandomWalkable())
  activeLevel.add(player)

  return { activeLevel, player, levels, newMap, changeLevel, getActive, movePlayerPos: newPlayerPos }

  function getActive() {
    return activeLevel
  }

  function newMap() {
    const gen = activeLevel.gen
    const index = levels.findIndex((e) => e === activeLevel)
    activeLevel.remove(player)

    // this all should be more generic
    let newLevelData: {
      terrainMap: TerrainMap
      seen: SeenMap
      levelWidth: number
      levelHeight: number
      gen: GenTypes
      subtype: string
    }

    if (activeLevel.levelData.subtype === 'cell2') newLevelData = cellular2()
    else if (gen instanceof Cellular) newLevelData = cellular()
    else if (gen instanceof CellularFixed) newLevelData = cellularFixed()
    else if (gen instanceof Arena) newLevelData = arena()
    else if (gen instanceof Digger) newLevelData = digger()
    else if (gen instanceof DividedMaze) newLevelData = divMaze()
    else if (gen instanceof IceyMaze) newLevelData = iceyMaze()
    else if (gen instanceof EllerMaze) newLevelData = ellerMaze()
    else if (gen instanceof Uniform) newLevelData = uniform()
    else if (gen instanceof Rogue) newLevelData = rogue()
    else throw new Error('newMap: unknown gen instance ' + activeLevel.gen.constructor.name)

    const newLevel = Level(newLevelData)
    levels[index] = newLevel
    activeLevel = newLevel

    activeLevel.add(player)
    return activeLevel
  }

  function changeLevel(to: number) {
    if (levels[to]) {
      activeLevel.remove(player)
      activeLevel = levels[to]
      activeLevel.add(player)
      console.log(
        'new activeLevel:',
        activeLevel.levelID,
        activeLevel.gen.constructor.name,
        activeLevel.levelData.subtype
      )
      return activeLevel
    }

    throw new Error(`${to} is not a level`)
  }

  function newPlayerPos() {
    const pos = player.get(Position)
    const { x, y } = activeLevel.getRandomWalkable()
    pos.x = x
    pos.y = y
  }
}
