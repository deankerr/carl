import { Component } from '../Core/Components'
import { Engine } from '../Core/Engine'
import { addLight, transformHSL } from '../lib/color'

export function renderRegion(engine: Engine) {
  const { mainDisplay, local } = engine
  if (local.hasChanged === false) return

  mainDisplay.clear()

  local.render((pt, entities, visible, recalled) => {
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
    // mainDisplay.draw(
    //   pt.x,
    //   pt.y,
    //   stack.map(s => s.char),
    //   stack.map(s => s.color),
    //   stack.map(s => s.bgColor)
    // )
    mainDisplay.draw(
      pt.x,
      pt.y,
      stack.map(s => s.char).at(-1),
      stack.map(s => s.color).at(-1),
      stack.map(s => s.bgColor).at(-1)
    )
  })
}

const fade = { sat: { by: 0.8 }, lum: { by: 0.8, min: 0.12 } }
