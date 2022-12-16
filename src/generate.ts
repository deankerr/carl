import { CONFIG } from './config'
import * as ROT from 'rot-js'
import { TerrainMap, SeenMap } from './Level'

import CellularFixed from './util/cellular'
import Arena from 'rot-js/lib/map/arena'
import Cellular from 'rot-js/lib/map/cellular'
import Digger from 'rot-js/lib/map/digger'
import DividedMaze from 'rot-js/lib/map/dividedmaze'
import IceyMaze from 'rot-js/lib/map/iceymaze'
import EllerMaze from 'rot-js/lib/map/ellermaze'
import Uniform from 'rot-js/lib/map/uniform'
import Rogue from 'rot-js/lib/map/rogue'
import { Dungeon1 } from './generate/Dungeon1'

export type GenTypes =
  | Arena
  | Digger
  | Cellular
  | CellularFixed
  | DividedMaze
  | IceyMaze
  | EllerMaze
  | Uniform
  | Rogue
  | Dungeon1

const levelWidth = CONFIG.displayWidth
const levelHeight = CONFIG.displayHeight - CONFIG.marginTop - CONFIG.marginBot

function newMapData() {
  const terrainMap: TerrainMap = {}
  const seen: SeenMap = {}
  return { terrainMap, seen }
}

export function arena() {
  console.log('New Arena!')
  const { terrainMap, seen } = newMapData()

  const gen = new ROT.Map.Arena(levelWidth, levelHeight)
  gen.create((x, y, content) => {
    terrainMap[`${x}-${y}`] = content
    seen[`${x}-${y}`] = false
  })

  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }
}

export function digger() {
  console.log('New Digger!')
  const { terrainMap, seen } = newMapData()

  const gen = new ROT.Map.Digger(levelWidth, levelHeight, { dugPercentage: 0.5 })
  gen.create((x, y, content) => {
    terrainMap[`${x}-${y}`] = content
    seen[`${x}-${y}`] = false
  })

  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }
}

// ROT.RNG.setSeed(451)
export function cellular() {
  console.log('New Celluar!')
  const { terrainMap, seen } = newMapData()
  const gen = new ROT.Map.Cellular(levelWidth, levelHeight)

  gen.randomize(0.5)
  cellStep()
  cellStep()
  cellStep()
  cellStep()
  cellStep()
  cellConnect()

  function cellStep() {
    gen.create((x, y, contents) => {
      terrainMap[`${x}-${y}`] = contents
      seen[`${x}-${y}`] = false
    })
  }

  function cellConnect() {
    gen.connect((x, y, contents) => {
      terrainMap[`${x}-${y}`] = contents
    }, 0)
  }

  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }
}

export function cellularFixed() {
  console.log('New CelluarFixed!')
  const { terrainMap, seen } = newMapData()
  const gen = new CellularFixed(levelWidth, levelHeight)

  gen.randomize(0.5)
  cellStep()
  cellStep()
  cellStep()
  cellStep()
  cellStep()
  cellConnect()

  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }

  function cellStep() {
    gen.create((x, y, contents) => {
      terrainMap[`${x}-${y}`] = contents
      seen[`${x}-${y}`] = false
    })
  }

  function cellConnect() {
    gen.connect((x, y, contents) => {
      terrainMap[`${x}-${y}`] = contents
    }, 0)
  }
}

export function cellular2() {
  console.log('New Celluar2')
  const { terrainMap, seen } = newMapData()
  const gen = new ROT.Map.Cellular(levelWidth, levelHeight, {
    born: [4, 5, 6, 7, 8],
    survive: [2, 3, 4, 5],
  })

  gen.randomize(0.9)

  let i = 50
  for (i; i >= 0; i--) {
    gen.create((x, y, contents) => {
      terrainMap[`${x}-${y}`] = contents
      seen[`${x}-${y}`] = false
    })
  }

  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: 'cell2' }
}

export function divMaze() {
  const { terrainMap, seen } = newMapData()
  const gen = new ROT.Map.DividedMaze(levelWidth, levelHeight)
  gen.create((x, y, contents) => {
    terrainMap[`${x}-${y}`] = contents
    seen[`${x}-${y}`] = false
  })
  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }
}

export function iceyMaze() {
  const { terrainMap, seen } = newMapData()

  // 0 = most random
  const reg = 3
  const gen = new ROT.Map.IceyMaze(levelWidth, levelHeight, reg)
  gen.create((x, y, contents) => {
    terrainMap[`${x}-${y}`] = contents
    seen[`${x}-${y}`] = false
  })

  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }
}

export function ellerMaze() {
  const { terrainMap, seen } = newMapData()
  const gen = new ROT.Map.EllerMaze(levelWidth, levelHeight)
  gen.create((x, y, contents) => {
    terrainMap[`${x}-${y}`] = contents
    seen[`${x}-${y}`] = false
  })

  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }
}

export function uniform() {
  const { terrainMap, seen } = newMapData()
  const gen = new ROT.Map.Uniform(levelWidth, levelHeight, {})

  gen.create((x, y, contents) => {
    terrainMap[`${x}-${y}`] = contents
    seen[`${x}-${y}`] = false
  })
  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }
}

export function rogue() {
  const { terrainMap, seen } = newMapData()
  const gen = new ROT.Map.Rogue(levelWidth, levelHeight, {})
  gen.create((x, y, contents) => {
    terrainMap[`${x}-${y}`] = contents
    seen[`${x}-${y}`] = false
  })
  return { terrainMap, seen, levelWidth, levelHeight, gen, subtype: '' }
}
