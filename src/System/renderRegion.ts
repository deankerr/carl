import { Engine } from '../Core/Engine'

export function renderRegion(engine: Engine) {
  const { mainDisplay, local } = engine

  local.render((pt, entities) => {
    const stack = entities.reduce(
      (acc, curr) => {
        return {
          char: [...acc.char, curr.form.char],
          color: [...acc.color, curr.form.color],
          bgColor: [...acc.bgColor, curr.form.bgColor],
        }
      },
      { char: [], color: [], bgColor: [] } as Record<string, string[]>
    )

    if (stack.char.length === 0) return

    mainDisplay.draw(pt.x, pt.y, stack.char, stack.color, stack.bgColor)
  })
}
