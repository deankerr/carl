import { Entity } from '../Core'
import { Engine } from '../Core/Engine'
import { addLight, transformHSL } from '../lib/color'
import { clamp, floor, half } from '../lib/util'
import { point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'

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

  const ground = local.pool.symbolic('ground').form
  const grc = transformHSL(ground.color, {
    sat: { by: 0.9, min: 0 },
    lum: { by: 0.95, min: 0 },
  })
  const groundRecalled = { ...ground, color: grc, bgColor: grc }
  const unknown = local.pool.symbolic('unknown').form

  mainDisplay.clear()

  // Iterate through the visible set of points the size of the main display
  viewportRect.traverse(viewPt => {
    // const voidTile =
    local.renderAt(viewPt.add(-offsetX, -offsetY), (entities, visible, recalled, lighting) => {
      const stack = [
        visible ? ground : recalled ? groundRecalled : unknown,
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

      // draw
      mainDisplay.draw(
        viewPt.x,
        viewPt.y,
        stack.map(s => s.char),
        stack.map(s => s.color),
        stack.map(s => s.bgColor)
      )
    })
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
