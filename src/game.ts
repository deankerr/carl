// import { CONFIG } from './config'
import * as ROT from 'rot-js'
// import { Entity } from './entity'
// import { input } from './input'
// import { Level } from './Level'
// import { FOV } from './components'
// import { HandlePlayer, HandleNPCs, UpdateFOV } from './Systems'
// import { World, activeLevel } from './_World'
import { World } from './World'
import { CONFIG } from './config'

// new implementation
import { Visualizer } from './generate/Visualizer'
import { Keys } from './keys'
import { Dungeon4 } from './generate/Dungeon4'
import { Visualizer4 } from './generate/Visualizer4'

// TODO Rethink using component fn names as keys, doesn't work with default minifier options

let display: ROT.Display

// let mouse = [0, 0]
// let lightsOn = false

let world: World
// let smiley = false
// let msg: string[] = ['You decide to exist, for a time.']
// let oldMsg: string[] = []

const keys = new Keys()
// keys.add(newWorld)

export function Game(d: ROT.Display) {
  // console.log('Game init')
  // ROT.RNG.setSeed(seed)

  display = d
  keys.add(readkeys)
  d4()

  function d4() {
    const d4 = Dungeon4(CONFIG.levelWidth, CONFIG.levelHeight)

    try {
      d4.create()
    } finally {
      // console.groupCollapsed('History')
      // console.log('hist:', d4.history)
      // d4.history.forEach((h) => {
      //   d4.consoleLogMap(h, true)
      // })
      // console.groupEnd()

      Visualizer4(display, d4.history, new Keys())
    }
  }

  function readkeys(key: string) {
    if (key === 'KeyN') d4()
  }

  // newWorld('Space')
}

function newWorld(code?: string) {
  if (code != 'Space') return
  world = new World()

  const visualizer = new Visualizer(display)
  // world.createLevel(CONFIG.levelWidth, CONFIG.levelHeight, 'dungeon2v2', visualizer)

  world.createLevel(CONFIG.levelWidth, CONFIG.levelHeight, 'dungeon3', visualizer)

  visualizer.active()
  visualizer.play()

  // console.log('a cell?', world.activeLevelGenerator?.get(p(2, 2)))
  // const last = world.activeLevelGenerator?.visualizer?.last()

  // if (last) renderTerrain(display, last, { x: 0, y: 2 })
  // else console.log('Game(): no last visual?')
}
//   const { player } = world

//   UpdateFOV(player, activeLevel)
//   // setTimeout(refresh, CONFIG.refreshRate)
//   render()

//   document.addEventListener('keydown', (event) => {
//     // if (event.code == 'KeyD') smiley = true
//     update(event)
//   })

//   // document.addEventListener('mousemove', (event) => {
//   //   mouse = display.eventToPosition(event)
//   // })

//   const ctx = display.getContainer()
//   if (ctx) {
//     ctx.addEventListener('mousedown', (event) => {
//       debugGetAt(display.eventToPosition(event), activeLevel, player)
//     })
//   }

//   console.log('Game started!')
//   return world
// }

// function update(event: KeyboardEvent) {
//   const utime = Date.now()
//   const { player } = world

//   if (msg.length > 0) {
//     oldMsg = msg.concat(oldMsg)
//     msg = []
//   }

//   // console.time('update')
//   const action = input(event)
//   console.log(`=== update(${event.code}) === Level: ${activeLevel.levelID}`, action)

//   if (action === null) return console.log('No action taken')

//   if ('ui' in action) {
//     if (action.ui === 'lightsOn') {
//       lightsOn = !lightsOn
//       console.log('Lignts on:', lightsOn)
//     } else if (action.ui === 'newMap') {
//       world.newMap()
//       UpdateFOV(world.player, activeLevel)
//     } else if (action.ui === 'cellular map step') {
//       activeLevel.cellStep()
//     } else if (action.ui === 'cellular map connect') {
//       activeLevel.cellConnect()
//     } else throw Error('Unkown UI Action ' + Object.entries(action))
//     render()
//     // return console.timeEnd('update')
//     return
//   }

//   if ('changeLevel' in action) {
//     world.changeLevel(action.changeLevel)
//     UpdateFOV(player, activeLevel)
//     render()
//     return
//   }

//   if ('newPlayerPos' in action) {
//     world.movePlayerPos()
//     UpdateFOV(player, activeLevel)
//     render()
//     return
//   }

//   HandlePlayer(player, action, activeLevel, msg)
//   UpdateFOV(player, activeLevel)
//   HandleNPCs(activeLevel, player, msg)

//   // Prune msg buffer
//   while (display.drawText(0, 0, '%c{#000}' + msg.join(' ') + ' %c{#444}' + oldMsg.join(' ')) > 3) {
//     oldMsg.pop()
//   }

//   render()
//   console.log(`--- update complete --- ${Date.now() - utime}ms`)
//   // console.timeEnd('update')
// }

// function render() {
//   // console.log('msg r:', msg)
//   // console.log('render level:', activeLevel.levelID)
//   const { getActive, player } = world
//   const activeLevel = getActive()
//   display.clear()

//   // Map info
//   // const index = world.levels.findIndex((e) => e === activeLevel) + 1
//   // const info = `Index: ${index}, ID: ${activeLevel.levelID}, ${activeLevel.gen.constructor.name} ${activeLevel.levelData.subtype}`
//   // display.drawText(0, 0, info)

//   // Message
//   if (msg.length > 0) display.drawText(0, 0, msg.join(' ') + ' %c{#444}' + oldMsg.join(' '))
//   else if (oldMsg.length > 0) display.drawText(0, 0, '%c{#444}' + oldMsg.join(' '))
//   // blank msg overflow
//   // for (let i = 0; i <= 80; i++) display.draw(i, 3, ' ', 'black', null)

//   // Terrain
//   const visible = player.get(FOV).visible
//   activeLevel.getTerrainMap((x, y, t) => {
//     if (visible[`${x}-${y}`] || lightsOn) {
//       display.draw(x, y + CONFIG.marginTop, t.renderVisible.char, t.renderVisible.fg, null)
//     } else if (activeLevel.isSeen(x, y)) {
//       display.draw(x, y + CONFIG.marginTop, t.renderSeen.char, t.renderSeen.fg, null)
//     }
//   })

//   // Entities
//   activeLevel.getRenderableEntities((x, y, r) => {
//     if (visible[`${x}-${y}`] || lightsOn) {
//       // console.log('render r:', r)
//       display.draw(x, y + CONFIG.marginTop, r.char, r.fg, null)
//     }
//   })

//   // Fake status bar
//   display.drawText(
//     1,
//     CONFIG.displayHeight - 2,
//     'Sad          Glip:12        Fred:17        Ass:5         Cx:56            Ned+'
//   )
//   // Mouse cursor
//   // if (smiley) display.draw(mouse[0], mouse[1], '☺', 'white', 'blue')
// }

// // function refresh() {
// //   // render()
// //   setTimeout(refresh, CONFIG.refreshRate)
// // }

// function debugGetAt(pos: number[], level: Level, player: Entity) {
//   const x = pos[0]
//   const y = pos[1] - CONFIG.marginTop
//   console.log(`========== CELL AT ${x}, ${y} ==========`)
//   console.log('Level:', level.levelID)
//   console.log('Terrain:', level.terrainAt(x, y))
//   console.log('Entities:', level.entitiesAt(x, y).length ? level.entitiesAt(x, y) : 'none')
//   console.log(`Visible:`, player.get(FOV).visible[x + '-' + y], 'Seen:', level.isSeen(x, y))
//   console.log(`========= HAVE A NICE DAY ==========`)
// }
