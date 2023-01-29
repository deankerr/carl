import { Region } from './Region'

export function renderRegion(region: Region) {
  const { display, point } = window.game

  // points.grid(region.width, region.height, pt => {
  //   const t = region.at(pt)
  //   display.draw(pt.x, pt.y, t.form.char, t.form.color, null)
  // })

  region.render((pt, entities) => {
    const e = entities[0]
    display.draw(pt.x, pt.y, e.form.char, e.form.color, null)
  })
}
