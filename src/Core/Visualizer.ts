/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!!!!!! dev
// import * as ROT from 'rot-js'

import { ActionTypes, Engine, Entity, Region } from '.'
import { GenHistory } from '../Generate/Overseer2'
import { point } from '../Model/Point'

export class Visualizer {
  engine = window.game
  mirror: Region
  player: Entity
  active = false

  index = 0
  playing = false

  constructor(targetRegion: Region, readonly history: GenHistory[]) {
    const { width, height, voidColor, voidColorUnrevealed } = targetRegion

    const player = this.engine.pool.spawn('player', point(0, 0))
    player.form = { char: '%', color: 'red', bgColor: 'transparent' }

    const r = new Region(width, height, this.engine.pool, player)
    r.revealAll = true
    r.voidColor = voidColor
    r.voidColorUnrevealed = voidColorUnrevealed
    r.name = 'mirror world'

    this.player = player
    this.mirror = r
    console.log('visualzer created')
  }

  run(action: ActionTypes) {
    if ('visualize' in action && !this.active) {
      console.log('vis init')
      this.engine.local = this.mirror
      this.active = true
      this.playing = true
      this.play()
    }
  }

  play() {
    if (!this.playing) {
      this.mirror.name = 'Complete'
      this.mirror.hasChanged = true
      return
    }
    this.next()
    setTimeout(this.play.bind(this), 250)
  }

  next() {
    this.index++
    if (this.index >= this.history.length) {
      this.playing = false
      return
    }
    const { terrain, features, beings, message } = this.history[this.index]
    this.mirror.name = message
    let loc = point(0, 0)
    for (const [pt, key] of terrain) {
      this.mirror.createTerrain(key, pt)
      loc = pt
    }

    for (const [pt, key] of beings) {
      this.mirror.createTerrain(key, pt)
      loc = pt
    }

    this.player.position = loc
  }
}

// export class Visualizer {
//   overseer: Overseer
//   worldProxy: World
//   level: Level
//   grids: Grid<TerrainTemplate>[] = []
//   entities: Entity[][] = []
//   markers: Entity[] = []

//   playing = false
//   speed = 500
//   lastFrame: number
//   index = 0
//   settimeout = 0

//   constructor(
//     readonly display: ROT.Display,
//     readonly msgDisplay: ROT.Display,
//     world: World,
//     readonly keys: Keys,
//     readonly restoreGame: Game['restoreContext']
//   ) {
//     const t = Date.now()
//     this.overseer = world.active.overseer
//     this.lastFrame = this.overseer.mutators.length - 1

//     // initialize each frame grid/entities
//     const grid = this.overseer.replay()
//     this.grids.push(grid)
//     const player = hydrate(Beings.player, Pt(-1, -1), 5)
//     this.entities.push([player])
//     this.load()

//     const level = new Level('false level', grid)
//     level.entities = this.entities[0]
//     this.level = level
//     // create a World proxy, intercept calls to the active level and replace with the current playback frame
//     const handler = {
//       get(target: World, prop: keyof World) {
//         // the fake playback level
//         if (prop === 'active') return level
//         // switch the lights on
//         if (prop === 'options') return { ...world.options, lightsOn: true }
//         return Reflect.get(target, prop)
//       },
//     }
//     this.worldProxy = new Proxy(world, handler)

//     console.log(`Visualizer (${Date.now() - t}ms)`)

//     this.keys.add(this.input.bind(this))
//     if (CONFIG.visualizerAutoplay) this.start()
//     else this.next()
//   }

//   input(code: string) {
//     switch (code) {
//       case 'KeyQ':
//         this.first()
//         break
//       case 'KeyW':
//         this.mid()
//         break
//       case 'KeyE':
//         this.last()
//         break
//       case 'ArrowLeft':
//         // console.log('Visualizer: previous')
//         this.stop()
//         this.backward()
//         break
//       case 'ArrowRight':
//         // console.log('Visualizer: forward')
//         this.stop()
//         this.forward()
//         break
//       case 'Space':
//         if (this.playing) {
//           // console.log('Visualizer: pause')
//           this.stop()
//         } else {
//           // console.log('Visualizer: play')
//           this.playing = true
//           this.forward()
//         }
//         break
//       case 'KeyV':
//         return this.cleanup()
//       case 'Minus':
//         // console.log('Visualizer: climb up')
//         return this.cleanup('debug_up')
//       case 'Equal':
//         // console.log('Visualizer: generate new level')
//         return this.cleanup('debug_down')
//       default:
//         console.log('Visualizer: no action for', code)
//     }
//   }

//   load() {
//     // console.log('LOAD')
//     const markerGroups: Entity[][] = []
//     while (this.index < this.lastFrame) {
//       this.index++

//       // copy previous grid, apply mutators
//       const mut = this.overseer.mutators[this.index].divulge()
//       const prevGrid = this.grids[this.index - 1]
//       const grid = this.overseer.replay()
//       prevGrid.each((pt, t) => grid.set(pt, t))
//       for (const [pts, t] of mut.terrain) grid.set(strToPt(pts), t)
//       this.grids.push(grid)

//       // hydrate entities
//       const entities: Entity[] = mut.clearMarkers
//         ? [...this.entities[this.index - 1]].filter(e => !e.id.includes('debug'))
//         : [...this.entities[this.index - 1]]
//       for (const [pts, e] of mut.entities) {
//         entities.push(hydrate(e, strToPt(pts)))
//       }

//       const markers: Entity[] = []
//       for (const [pts, e] of mut.markers) {
//         const mark = hydrate(e, strToPt(pts))
//         entities.push(mark)
//         markers.push(mark)
//       }
//       if (markers.length > 0) markerGroups.push(markers)

//       this.entities.push(entities)
//     }

//     // color each debug marker with a lovely spread of hues
//     if (markerGroups.length > 0) {
//       const hues = 1 / (markerGroups.length + 1)
//       const base = Features.debugMarker.color
//       markerGroups.forEach((g, i) => {
//         // alternate between the start and middle of the color wheel
//         const hue = i % 2 == 0 ? hues * i : hues * i + 0.5
//         const c = transformHSL(base, { hue: { add: hue } })
//         g.forEach(m => (m.color = c))
//       })
//     }
//   }

//   start() {
//     // console.log('START')
//     this.index = -1
//     this.playing = true
//     this.forward()
//   }

//   next() {
//     this.level.terrainGrid = this.grids[this.index]
//     this.level.entities = this.entities[this.index]
//     this.render()
//   }

//   forward() {
//     if (this.index + 1 <= this.lastFrame) {
//       this.index++
//       this.next()
//       if (this.playing) this.settimeout = setTimeout(() => requestAnimationFrame(this.forward.bind(this)), this.speed)
//     } else {
//       this.playing = false
//       console.log('Playback complete')
//     }
//   }

//   backward() {
//     if (this.index - 1 >= 0) {
//       this.index--
//       this.next()
//     } else console.log("You can't go back.")
//   }

//   first() {
//     this.stop()
//     this.index = 0
//     this.next()
//   }

//   mid() {
//     this.stop()
//     this.index = half(this.lastFrame)
//     this.next()
//   }

//   last() {
//     this.stop()
//     this.index = this.lastFrame
//     this.next()
//   }

//   stop() {
//     this.playing = false
//     clearTimeout(this.settimeout)
//   }

//   render() {
//     renderLevel(this.display, this.worldProxy)
//     this.msgDisplay.clear()
//     this.msgDisplay.drawText(0, 3, 'Visualizer ' + this.index + '/' + this.lastFrame)
//   }

//   cleanup(gen = '') {
//     console.log('Visualizer cleanup')
//     this.stop()
//     this.keys.cleanup()
//     this.restoreGame(gen)
//   }
// }
