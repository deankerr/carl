import { CONFIG } from '../config'
import { Entity } from '../Core'
import { Engine } from '../Core/Engine'
import { addLight, transformHSL } from '../lib/color'
import { clamp, floor, half } from '../lib/util'
import { point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'

// record the time and type of the last light flicker update
let lastLightFlicker = 0
let flickerDimmed = false

export function renderRegion(engine: Engine) {
  const { mainDisplay, local } = engine
  if (!local.hasChanged) return

  // * ========== Viewport ========== *
  const { width, height } = mainDisplay.getOptions()

  const lastX = width - 1
  const lastY = height - 1

  const vpStart = point(0, 0)
  const vpEnd = point(lastX, lastY)

  const viewportRect = Rect.atxy2(vpStart, vpEnd)

  const player = local.player()
  const centerX = floor(width / 2)
  const centerY = floor(height / 2)

  const offsetX =
    local.width > viewportRect.width
      ? clamp(
          viewportRect.width - local.width,
          viewportRect.x + centerX - player.position.x,
          viewportRect.x
        )
      : viewportRect.x + half(viewportRect.width - local.width)

  const offsetY =
    local.height >= viewportRect.height
      ? clamp(
          viewportRect.y + viewportRect.height - local.height,
          viewportRect.y + centerY - player.position.y,
          viewportRect.y
        )
      : viewportRect.y + half(viewportRect.height - local.height)

  // * ========== Rendering ========== *

  // replace any void terrain with these locally colored ones
  // const voidTerrain = local.voidTiles()

  const ground = local.pool.symbolic('T2caveFloor1')
  const unknown = local.pool.symbolic('unknown')

  const { areaKnown, areaVisible, lighting } = local
  const entities = local.get('position')

  mainDisplay.clear()

  // Iterate through the visible set of points the size of the main display
  viewportRect.traverse(viewPt => {
    // the region location to render here
    const pt = viewPt.add(-offsetX, -offsetY)

    const known = local.revealAll || local.recallAll || (areaKnown.get(pt) ?? false)
    const visible = local.revealAll || (areaVisible.get(pt) ?? false)

    if (!known) {
      // unrevealed area
      mainDisplay.draw(viewPt.x, viewPt.y, unknown.form.char, unknown.form.color, null)
    } else {
      // currently visible
      const stack: Entity[] = [ground]
      const here = entities.filter(e => e.position === pt)

      const terrain = local.terrainMap.get(pt)
      const features = here.filter(e => e.feature)

      if (visible) {
        // only render beings if area visible
        const beings = here.filter(e => e.being)

        if (beings.length > 0) {
          // only render tagged terrain/features under beings
          if (terrain && terrain.renderUnderBeing) stack.push(terrain)
          if (features.length > 0) stack.push(...features.filter(f => f.renderUnderBeing))
          stack.push(...beings)
        } else {
          // no beings, render everything
          if (terrain) stack.push(terrain)
          if (features.length > 0) stack.push(...features)
        }
      } else {
        // area previously seen, render terrain and memorable features
        if (terrain) stack.push(terrain)
        stack.push(...features.filter(f => f.memorable))
      }

      // sort z-levels
      stack.sort((a, b) => zLevel(a) - zLevel(b))

      // extract form data, applying lighting/fade if applicable
      const formStack = stack.map(e => {
        const form = { ...e.form }
        if (visible && lighting.has(pt)) {
          const light = lighting.get(pt) ?? [0, 0, 0]
          if (Date.now() - lastLightFlicker > CONFIG.lightFlickerFreq) {
            flickerDimmed = !flickerDimmed
            lastLightFlicker = Date.now()
          }
          form.color = addLight(form.color, light, flickerDimmed)
        } else if (known && !visible) {
          form.color = transformHSL(form.color, recalledFade)
        }
        return form
      })

      // draw
      mainDisplay.draw(
        viewPt.x,
        viewPt.y,
        formStack.map(s => s.char),
        formStack.map(s => s.color),
        formStack.map(s => s.bgColor)
      )
    }
  })
}

const recalledFade = { sat: { by: 0.8 }, lum: { by: 0.8 } }

const zLevel = (e: Entity) => {
  return 'being' in e ? 2 : 'feature' in e ? 1 : 0
}

// background color cycle
// if (options.bgColor !== '' && options.bgCycle && Date.now() - last > freq) {
//   options.bgColor = transformHSL(options.bgColor, { hue: { add } })
//   last = Date.now()
// }
