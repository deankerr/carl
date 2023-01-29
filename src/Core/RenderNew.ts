/* eslint-disable @typescript-eslint/no-unused-vars */
import { Region } from './Region'

export function renderRegion(region: Region) {
  const { display, point } = window.game

  region.render((pt, entities) => {
    const chars = entities.map(e => e.form.char)
    const colors = entities.map(e => e.form.color)
    const bgColors = entities.map(e => e.form.bgColor)
    display.draw(pt.x, pt.y, chars, colors, bgColors)
  })
}
