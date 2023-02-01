import { CONFIG } from '../config'
import { Engine } from '../Core/Engine'
import { addLight, transformHSL } from '../lib/color'
import { clamp, floor, half } from '../lib/util'

export function renderRegion(engine: Engine) {
  const { mainDisplay, local } = engine
  if (local.hasChanged === false) return

  // * ========== Viewport ========== *
  const { mainDisplayWidth, mainDisplayHeight } = CONFIG
  const viewport = {
    w: mainDisplayWidth,
    h: mainDisplayHeight,
    x1: 0,
    x2: mainDisplayWidth - 1,
    y1: 0,
    y2: mainDisplayHeight - 1,
  }

  const player = local.player()
  const centerX = floor(mainDisplayWidth / 2)
  const centerY = floor(mainDisplayHeight / 2)

  const offsetX =
    local.width > viewport.w
      ? clamp(viewport.w - local.width, viewport.x1 + centerX - player.position.x, viewport.x1)
      : viewport.x1 + half(viewport.w - local.width)

  const offsetY =
    local.height >= viewport.h
      ? clamp(
          viewport.y1 + viewport.h - local.height,
          viewport.y1 + centerY - player.position.y,
          viewport.y1
        )
      : viewport.y1 + half(viewport.h - local.height)

  // * ========== Rendering ========== *

  // replace any void terrain with this locally colored one
  const voidLocal = { char: 'void', color: local.voidColor, bgColor: local.voidColor }

  mainDisplay.clear()

  local.render((pt, entities, visible, recalled) => {
    const render = { x: offsetX + pt.x, y: offsetY + pt.y }

    // skip this location if we're outside of the viewport
    if (
      render.x < viewport.x1 ||
      render.x > viewport.x2 ||
      render.y < viewport.y1 ||
      render.y > viewport.y2
    ) {
      return
    }

    const lighting = local.lighting.get(pt)

    const stack = [
      voidLocal,
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
        // 3. extract relevant display data, applying lighting or fade effects
        .map(e => {
          const form = { ...e.form }
          if (visible && lighting) {
            // don't add light to something that is emitting light, which can look bad
            if (!e.emitLight?.enabled) form.color = addLight(form.color, lighting)
          } else if (recalled) form.color = transformHSL(form.color, recalledFade)
          return form
        }), // ? sort
    ]

    // * abort if we somehow ended up with nothing or ROT.JS will error
    if (stack.length === 0) return

    // * draw
    mainDisplay.draw(
      pt.x,
      pt.y,
      stack.map(s => s.char),
      stack.map(s => s.color),
      stack.map(s => s.bgColor)
    )
  })
}

const recalledFade = { sat: { by: 0.8 }, lum: { by: 0.8, min: 0.12 } }

// background color cycle
// if (options.bgColor !== '' && options.bgCycle && Date.now() - last > freq) {
//   options.bgColor = transformHSL(options.bgColor, { hue: { add } })
//   last = Date.now()
// }
