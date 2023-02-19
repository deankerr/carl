import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Entity, EntityWith } from '../Core'
import { Engine } from '../Core/Engine'
import { addLight, transformHSL } from '../lib/color'
import { clamp, floor, half } from '../lib/util'
import { point } from '../lib/Shape/Point'
import { Rect } from '../lib/Shape/Rectangle'

// record the time and type of the last light flicker update
// let lastLightFlicker = 0
// let flickerDimmed = false

export function renderRegion(engine: Engine) {
  const { mainDisplay, local, textDisplay } = engine
  if (!local.hasChanged) return

  // * ========== Viewport ========== *
  const { width, height } = mainDisplay.getOptions()

  const lastX = width - 1
  const lastY = height - 1

  const vpStart = point(0, 0)
  const vpEnd = point(lastX, lastY)

  const viewportRect = Rect.atxy2(vpStart, vpEnd)

  const playerPos = local.player()?.position ?? { x: 0, y: 0 }
  const centerX = floor(width / 2)
  const centerY = floor(height / 2)

  const offsetX =
    local.width > viewportRect.width
      ? clamp(
          viewportRect.width - local.width,
          viewportRect.x + centerX - playerPos.x,
          viewportRect.x
        )
      : viewportRect.x + half(viewportRect.width - local.width)

  const offsetY =
    local.height >= viewportRect.height
      ? clamp(
          viewportRect.y + viewportRect.height - local.height,
          viewportRect.y + centerY - playerPos.y,
          viewportRect.y
        )
      : viewportRect.y + half(viewportRect.height - local.height)

  // * ========== Rendering ========== *

  const unknown = local.pool.symbolic('unknown')
  const nothing = local.pool.symbolic('nothing')

  const { areaKnown, areaVisible, lighting } = local
  const entities = local.get('position')

  mainDisplay.clear()

  // Iterate through the visible set of points the size of the main display
  viewportRect.traverse(viewPt => {
    // the cell to render here
    const pt = viewPt.add(-offsetX, -offsetY)

    const known = local.revealAll || local.recallAll || (areaKnown.get(pt) ?? false)
    const visible = local.revealAll || (areaVisible.get(pt) ?? false)

    if (!known) {
      // unrevealed area
      mainDisplay.draw(viewPt.x, viewPt.y, unknown.sprite.base.tile, 'transparent', 'transparent')
    } else {
      // currently visible
      const stack: Entity[] = [nothing]
      const here = entities.filter(e => e.position === pt && !e.invisible)

      const terrain = local.terrainAt(pt)
      const features = here.filter(e => e.feature)
      const items = here.filter(e => e.item)

      if (visible) {
        const beings = here.filter(e => e.being)
        if (terrain) stack.push(terrain)
        stack.push(...features)
        stack.push(...items)
        stack.push(...beings)
      } else {
        // area previously seen, render terrain and features
        stack.push(terrain)
        stack.push(...features)
        stack.push(...items)
      }

      // sort z-levels
      stack.sort((a, b) => zLevel(a) - zLevel(b))

      // extract form data, applying lighting/fade if applicable
      const renderStack = stack.map(e => {
        const { base, ledge, trigger, exposed, noise } = e.sprite
        const render = { char: e.sprite.base.tile, color: 'transparent', bgColor: 'transparent' }

        // liquid
        if (ledge) {
          const tAbove = local.terrainAt(pt.north(1))
          if (tAbove.key !== e.key) {
            render.char = ledge.tile
          }
        }

        // being
        if (e.facing && e.sprite[e.facing]) {
          const s = e.sprite[e.facing]?.tile
          if (s) render.char = s
        }

        // doors
        if (trigger && base) {
          trigger.forEach((trig, i) => {
            if (trig in e) render.char = base.tiles[i]
          })
        }

        // wall/floor/noise decoration
        if (exposed || noise) {
          let sprite = base
          let i = 0
          if (exposed) {
            const tBelow = local.terrainAt(pt.south(1))
            if (!tBelow.wall) sprite = exposed
          }

          if (noise) {
            const len = base.tiles.length - 1
            const v = local.noise.get(pt.x, pt.y)
            const vMod = Math.round(((v + 1) * 255) / 2) % len

            i = v <= 0 ? 0 : vMod
          }
          render.char = sprite.tiles[i]
        }

        if (visible && lighting.has(pt)) {
          // const light = lighting.get(pt) ?? [0, 0, 0]
          // if (Date.now() - lastLightFlicker > CONFIG.lightFlickerFreq) {
          //   flickerDimmed = !flickerDimmed
          //   lastLightFlicker = Date.now()
          // }
          // render.color = addLight(render.color, light, flickerDimmed)
        } else if (known && !visible) {
          // render.color = transformHSL(render.color, recalledFade)
        }
        return render
      })

      // draw
      mainDisplay.draw(
        viewPt.x,
        viewPt.y,
        renderStack.map(s => s.char),
        renderStack.map(s => (s.color === '' ? 'transparent' : s.color)),
        renderStack.map(s => (s.bgColor === '' ? 'transparent' : s.bgColor))
      )
    }
  })
}

const recalledFade = { sat: { by: 0.8 }, lum: { by: 0.8 } }

const zLevel = (e: Entity) => {
  if (e.renderLevelHigh) return 10
  if (e.being) return 7
  if (e.item) return 5
  if (e.feature) return 3
  return 0
}

// background color cycle
// if (options.bgColor !== '' && options.bgCycle && Date.now() - last > freq) {
//   options.bgColor = transformHSL(options.bgColor, { hue: { add } })
//   last = Date.now()
// }
