import { CONFIG } from '../config'
import { Component } from '../Core/Components'
import { Engine } from '../Core/Engine'
import { addLight, transformHSL } from '../lib/color'
import { clamp, floor, half } from '../lib/util'

export function renderRegion(engine: Engine) {
  const { mainDisplay, local, options } = engine
  if (local.hasChanged === false) return
  const { mainDisplayWidth, mainDisplayHeight } = CONFIG

  // * ========== Viewport ========== *
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

    const stack: Component<'form'>['form'][] = []

    if (visible) {
      const lighting = local.lighting.get(pt)
      if (lighting) {
        entities.forEach(e => {
          stack.push({ ...e.form, color: addLight(e.form.color, lighting) })
        })
      } else entities.forEach(e => stack.push(e.form))
    } else if (recalled) {
      const recalledEntities = entities.filter(e => e.terrain || e.memorable)
      recalledEntities.forEach(e =>
        stack.push({ ...e.form, color: transformHSL(e.form.color, fade) })
      )
    }

    if (stack.length === 0) return
    if (options.renderStack) {
      mainDisplay.draw(
        pt.x,
        pt.y,
        stack.map(s => s.char),
        stack.map(s => s.color),
        stack.map(s => s.bgColor)
      )
    } else {
      mainDisplay.draw(
        render.x,
        render.y,
        stack[stack.length - 1].char,
        stack[stack.length - 1].color,
        stack[stack.length - 1].bgColor
      )
    }
  })
}

const fade = { sat: { by: 0.8 }, lum: { by: 0.8, min: 0.12 } }
