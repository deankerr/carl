/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!!!!!! dev
import * as ROT from 'rot-js'
import { Mutator, Overseer } from '../Generate/Overseer'
import { Keys } from '../lib/Keys'
import { Game } from './Game'
import { World } from './World'
import { renderLevel, renderMessages } from './Render'
import { Level } from '../Model/Level'
import { Entity, hydrate } from './Entity'
import { Beings, Features, Terrain, TerrainTemplate } from '../Templates'
import { Pt, StrPt } from '../Model/Point'
import { CONFIG } from '../config'
import { Grid } from '../Model/Grid'
import { Color } from 'rot-js/lib/color'
import { range } from '../lib/util'
import { hexToHSL, transformHSL } from '../lib/color'

export class Visualizer {
  overseer: Overseer
  worldProxy: World
  level: Level
  grids: Grid<TerrainTemplate>[] = []
  entities: Entity[][] = []
  markers: Entity[] = []

  playing = false
  speed = 250
  lastFrame: number
  index = 0
  settimeout = 0

  constructor(
    readonly display: ROT.Display,
    readonly msgDisplay: ROT.Display,
    world: World,
    readonly keys: Keys,
    readonly restoreGame: Game['restoreContext']
  ) {
    const t = Date.now()
    console.log('Visualizer init')
    this.overseer = world.active.overseer
    this.lastFrame = this.overseer.mutators.length - 1

    // initialize each frame grid/entities
    const grid = this.overseer.replay()
    this.grids.push(grid)
    const player = hydrate(Beings.player, Pt(-1, -1), 5)
    this.entities.push([player])
    this.load()

    const level = new Level('false level', grid)
    level.entities = this.entities[0]
    this.level = level
    // create a World proxy, intercept calls to the active level and replace with the current playback frame
    const handler = {
      get(target: World, prop: keyof World) {
        if (prop === 'active') return level
        return Reflect.get(target, prop)
      },
    }
    this.worldProxy = new Proxy(world, handler)

    console.log(`Visualizer load took ${Date.now() - t}ms`)

    this.keys.add(this.input.bind(this))
    if (CONFIG.visualizerAutoplay) this.start()
    else this.next()
  }

  input(code: string) {
    switch (code) {
      case 'KeyR':
        console.log('Visualizer: restart')
        this.stop()
        this.index = 0
        this.next()
        break
      case 'ArrowLeft':
        console.log('Visualizer: previous')
        this.stop()
        this.backward()
        break
      case 'ArrowRight':
        console.log('Visualizer: forward')
        this.stop()
        this.forward()
        break
      case 'Space':
        if (this.playing) {
          console.log('Visualizer: pause')
          this.stop()
        } else {
          console.log('Visualizer: play')
          this.playing = true
          this.forward()
        }
        break
      case 'KeyV':
        return this.cleanup()
      case 'Minus':
        console.log('Visualizer: climb up')
        return this.cleanup('debug_up')
      case 'Equal':
        console.log('Visualizer: generate new level')
        return this.cleanup('debug_down')
      default:
        console.log('Visualizer: no action for', code)
    }
  }

  load() {
    console.log('LOAD')
    const markerGroups: Entity[][] = []
    while (this.index < this.lastFrame) {
      this.index++

      // copy previous grid, apply mutators
      const mut = this.overseer.mutators[this.index]
      const prevGrid = this.grids[this.index - 1]
      const grid = this.overseer.replay()
      prevGrid.each((pt, t) => grid.set(pt, t))
      for (const [pts, t] of mut.terrain) grid.set(StrPt(pts), t)
      this.grids.push(grid)

      // hydrate entities
      const entities: Entity[] = [...this.entities[this.index - 1]]
      for (const [pts, e] of mut.entities) {
        entities.push(hydrate(e, StrPt(pts)))
      }

      const markers: Entity[] = []
      for (const [pts, e] of mut.markers) {
        const mark = hydrate(e, StrPt(pts))
        entities.push(mark)
        markers.push(mark)
      }
      if (markers.length > 0) markerGroups.push(markers)

      this.entities.push(entities)
    }

    // color each debug marker with a lovely spread of hues
    if (markerGroups.length > 0) {
      const hues = 1 / (markerGroups.length + 1)
      const base = Features.debugMarker.color
      markerGroups.forEach((g, i) => {
        const c = transformHSL(base, { hue: { add: hues * i } })
        g.forEach(m => (m.color = c))
      })
    }
  }

  start() {
    console.log('START')
    this.index = 0
    this.playing = true
    this.forward()
  }

  next() {
    this.level.terrainGrid = this.grids[this.index]
    this.level.entities = this.entities[this.index]
    this.render()
  }

  forward() {
    if (this.index + 1 <= this.lastFrame) {
      this.index++
      this.next()
      if (this.playing) this.settimeout = setTimeout(() => requestAnimationFrame(this.forward.bind(this)), this.speed)
    } else {
      this.playing = false
      console.log('Playback complete')
    }
  }

  backward() {
    if (this.index - 1 >= 0) {
      this.index--
      this.next()
    } else console.log("You can't go back.")
  }

  stop() {
    this.playing = false
    clearTimeout(this.settimeout)
  }

  render() {
    renderLevel(this.display, this.worldProxy)
    this.msgDisplay.clear()
    this.msgDisplay.drawText(0, 3, 'Visualizer ' + this.index + '/' + this.lastFrame)
  }

  cleanup(gen = '') {
    console.log('Visualizer cleanup')
    this.stop()
    this.keys.cleanup()
    this.restoreGame(gen)
  }
}
