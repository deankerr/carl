import { CONFIG } from '../config'
import { Component } from '../Core/Components'
import { Engine } from '../Core/Engine'
import { Entity } from '../Core/Entity'
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

    // * determine which entities should be rendered and in what order
    let terrain: Entity[] = []
    const feature: Entity[] = []
    const being: Entity[] = []

    // if visible, render everything
    if (visible) {
      entities.forEach(e => {
        if (e.terrain) terrain.push(e)
        else if (e.being) being.push(e)
        else feature.push(e) // ? render anything without a tag as feature
      })
    } else if (recalled) {
      // if recalled, render only terrain and memorable things
      entities.forEach(e => {
        if (e.terrain) terrain.push(e)
        else if (e.memorable) feature.push(e)
      })
    } // ... if not visible or recalled, render nothing

    // * strip any "void" terrain, insert a custom void with local color (ie. local background color)
    const voidLocal = {
      ...local.pool.symbolic('void'),
      form: { char: 'void', color: local.voidColor, bgColor: local.voidColor },
    }
    terrain = [voidLocal, ...terrain.filter(t => t.label !== 'void')]

    // * assemble stack of render data
    const formStack: Component<'form'>['form'][] = []

    // - render only flagged terrain/features under a being
    if (being.length > 0) {
      formStack.push(...terrain.filter(t => t.renderUnderBeing).map(t => t.form))
      formStack.push(...feature.filter(f => f.renderUnderBeing).map(f => f.form))
      formStack.push(...being.map(b => b.form))
    } else {
      // otherwise everything
      formStack.push(...terrain.map(t => t.form))
      formStack.push(...feature.map(f => f.form))
    }

    // * apply lighting/faded color if applicable
    let colorStack: Component<'form'>['form'][] = []

    if (visible && lighting)
      colorStack = formStack.map(f => (f = { ...f, color: addLight(f.color, lighting) }))
    else if (!visible && recalled)
      colorStack = formStack.map(f => (f = { ...f, color: transformHSL(f.color, recalledFade) }))
    else colorStack = formStack

    // * abort if we ended up with nothing or ROT.JS will error
    if (colorStack.length === 0) return

    // * draw
    mainDisplay.draw(
      pt.x,
      pt.y,
      colorStack.map(s => s.char),
      colorStack.map(s => s.color),
      colorStack.map(s => s.bgColor)
    )
  })
}

const recalledFade = { sat: { by: 0.8 }, lum: { by: 0.8, min: 0.12 } }

// background color cycle
// if (options.bgColor !== '' && options.bgCycle && Date.now() - last > freq) {
//   options.bgColor = transformHSL(options.bgColor, { hue: { add } })
//   last = Date.now()
// }
