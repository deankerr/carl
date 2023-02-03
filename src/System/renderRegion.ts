import { Entity } from '../Core'
import { Engine } from '../Core/Engine'
import { addLight, transformHSL } from '../lib/color'
import { clamp, floor, half } from '../lib/util'
import { pointRect } from '../Model/Point'

export function renderRegion(engine: Engine) {
  const { mainDisplay, local } = engine
  if (!local.hasChanged) return

  // * ========== Viewport ========== *
  const { width, height } = mainDisplay.getOptions()
  const viewportRect = {
    w: width,
    h: height,
    x1: 0,
    x2: width - 1,
    y1: 0,
    y2: height - 1,
  }

  const player = local.player()
  const centerX = floor(width / 2)
  const centerY = floor(height / 2)

  const offsetX =
    local.width > viewportRect.w
      ? clamp(
          viewportRect.w - local.width,
          viewportRect.x1 + centerX - player.position.x,
          viewportRect.x1
        )
      : viewportRect.x1 + half(viewportRect.w - local.width)

  const offsetY =
    local.height >= viewportRect.h
      ? clamp(
          viewportRect.y1 + viewportRect.h - local.height,
          viewportRect.y1 + centerY - player.position.y,
          viewportRect.y1
        )
      : viewportRect.y1 + half(viewportRect.h - local.height)

  // * ========== Rendering ========== *

  // replace any void terrain with this locally colored one
  const voidLocal = { char: 'v', color: local.voidColor, bgColor: local.voidColor }

  const recalledColor = transformHSL(local.voidColor, {
    sat: { by: 0.9, min: 0 },
    lum: { by: 0.95, min: 0 },
  })
  const voidRecalled = { ...voidLocal, color: recalledColor, bgColor: recalledColor }

  const voidLocalUnrevealed = {
    char: 'v',
    color: local.voidColorUnrevealed,
    bgColor: local.voidColorUnrevealed,
  }

  mainDisplay.clear()

  // Iterate through the visible set of points the size of the main display
  pointRect(-offsetX, -offsetY, width - offsetX, height - offsetY, gridPt => {
    // const voidTile =
    local.renderAt(gridPt, (entities, visible, recalled, lighting) => {
      const stack = [
        visible ? voidLocal : recalled ? voidRecalled : voidLocalUnrevealed,
        ...entities
          // 1. remove void terrain
          .filter(e => e.label !== 'void')
          // 2. determine which beings are to be rendered
          .filter(e => {
            if (visible) {
              const beingPresent = entities.some(e => e.being)
              // if player can see the area, render beings + renderUnderBeings flagged
              if (e.being) return true
              else if (beingPresent) {
                return e.renderUnderBeing
              } else return true
            } else if (recalled) {
              // if area remembered, render just terrain + memorable features
              return e.terrain || e.memorable
            }
            // if not visible or recalled, render nothing
            return false
          })
          // 3. sort beings on top, then features, terrain
          .sort((a, b) => zLevel(a) - zLevel(b))
          // 4. extract relevant display data, applying lighting or fade effects
          .map(e => {
            const form = { char: e.form.char, color: e.form.color, bgColor: e.form.bgColor }
            if (visible) {
              // don't add light to something that is emitting light, which can look bad
              if (lighting && !e.emitLight?.enabled) form.color = addLight(form.color, lighting)
            } else if (recalled) {
              form.color = transformHSL(form.color, recalledFade)
            }
            return form
          }), // ? sort
      ]

      // abort if we somehow ended up with nothing or ROT.JS will error
      if (stack.length === 0) return
      // if (gridPt.x + offsetX === 0 && gridPt.y + offsetY === 0) console.log(recalled, stack)
      // draw
      mainDisplay.draw(
        gridPt.x + offsetX,
        gridPt.y + offsetY,
        stack.map(s => s.char),
        stack.map(s => s.color),
        stack.map(s => s.bgColor)
      )
    })
  })
}

const recalledFade = { sat: { by: 0.8 }, lum: { by: 0.8, min: 0.12 } }

const zLevel = (e: Entity) => {
  return 'being' in e ? 2 : 'feature' in e ? 1 : 0
}

// background color cycle
// if (options.bgColor !== '' && options.bgCycle && Date.now() - last > freq) {
//   options.bgColor = transformHSL(options.bgColor, { hue: { add } })
//   last = Date.now()
// }
