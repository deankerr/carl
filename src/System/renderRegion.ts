import { Component } from '../Core/Components'
import { Engine } from '../Core/Engine'
import { transformHSL } from '../lib/color'

export function renderRegion(engine: Engine) {
  const { mainDisplay, local } = engine
  mainDisplay.clear()
  const [player] = local.get('playerControlled', 'fieldOfView')
  local.render((pt, entities, revealed) => {
    const visible = player.fieldOfView.visible.has(pt)

    const stack: Component<'form'>['form'][] = []

    if (visible) {
      entities.forEach(e => stack.push(e.form))
    } else if (revealed) {
      const recalledEntities = entities.filter(e => e.terrain || e.memorable)
      recalledEntities.forEach(e => stack.push({ ...e.form, color: transformHSL(e.form.color, fade) }))
    }

    if (stack.length === 0) return

    const split = {
      char: stack.map(s => s.char),
      color: stack.map(s => s.color),
      bgColor: stack.map(s => s.bgColor),
    }
    mainDisplay.draw(pt.x, pt.y, split.char, split.color, split.bgColor)
  })
}

const fade = { sat: { by: 0.8 }, lum: { by: 0.8, min: 0.12 } }
