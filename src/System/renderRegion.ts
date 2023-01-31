import { Component } from '../Core/Components'
import { Engine } from '../Core/Engine'
import { transformHSL } from '../lib/color'

export function renderRegion(engine: Engine) {
  const { mainDisplay, local } = engine
  mainDisplay.clear()

  local.render((pt, entities, visible, revealed) => {
    const stack: Component<'form'>['form'][] = []

    if (visible) {
      entities.forEach(e => stack.push(e.form))
    } else if (revealed) {
      const recalledEntities = entities.filter(e => e.terrain || e.memorable)
      recalledEntities.forEach(e => stack.push({ ...e.form, color: transformHSL(e.form.color, fade) }))
    }

    if (stack.length === 0) return
    mainDisplay.draw(
      pt.x,
      pt.y,
      stack.map(s => s.char),
      stack.map(s => s.color),
      stack.map(s => s.bgColor)
    )
  })
}

const fade = { sat: { by: 0.8 }, lum: { by: 0.8, min: 0.12 } }
