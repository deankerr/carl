import * as ROT from 'rot-js'
import { Region } from '../Core/Region'

export function processRenderRegion(region: Region, display: ROT.Display) {
  const last = display.getOptions().height - 1

  region.render((pt, entities) => {
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

    display.draw(pt.x, pt.y, stack.char, stack.color, stack.bgColor)
  })
  display.drawText(1, 1, 'im da render process')
  display.drawText(0, last, spinner.next())
}

const createSpinner = () => {
  const g = ['-', '\\', '|', '/']
  let i = 0
  const next = () => {
    i = i >= g.length - 1 ? 0 : i + 1
    return `%c{#333}${g[i]}%c{}`
  }

  return { next }
}

const spinner = createSpinner()
