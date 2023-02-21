import { Entity } from '../Core'
import { Engine } from '../Core/Engine'
import { point } from '../lib/Shape/Point'
import { Rect } from '../lib/Shape/Rectangle'
import { clamp, floor, half } from '../lib/util'

export function renderRegion(engine: Engine) {
  const { mainDisplay, local } = engine

  // * ========== Viewport ========== *
  const { width, height } = mainDisplay.getOptions()

  const lastX = width - 1
  const lastY = height - 1

  const vpStart = point(0, 0)
  const vpEnd = point(lastX, lastY)

  const viewportRect = Rect.atxy2(vpStart, vpEnd)

  const playerPos = local.player()?.position ?? { x: 0, y: 0 }
  const centerX = floor(width / 2)
  const centerY = floor(height / 2)

  const offsetX =
    local.width > viewportRect.width
      ? clamp(
          viewportRect.width - local.width,
          viewportRect.x + centerX - playerPos.x,
          viewportRect.x
        )
      : viewportRect.x + half(viewportRect.width - local.width)

  const offsetY =
    local.height >= viewportRect.height
      ? clamp(
          viewportRect.y + viewportRect.height - local.height,
          viewportRect.y + centerY - playerPos.y,
          viewportRect.y
        )
      : viewportRect.y + half(viewportRect.height - local.height)

  // * ========== Rendering ========== *

  const nothing = local.pool.symbolic('nothing')
  const shroudedFog = local.pool.symbolic(local.visibility.shrouded)
  const unrevealedFog = local.pool.symbolic(local.visibility.unrevealed)

  const { areaKnown, areaVisible } = local
  const entities = local.get('position')

  mainDisplay.clear()

  // Iterate through the visible set of points the size of the main display
  viewportRect.traverse(viewPt => {
    // the cell to render here
    const pt = viewPt.add(-offsetX, -offsetY)

    const visible = local.revealAll || (areaVisible.get(pt) ?? false)
    const shrouded = local.revealAll || local.recallAll || (areaKnown.get(pt) ?? false)

    const stack: Entity[] = [nothing]
    const here = entities.filter(e => e.position === pt && !e.invisible)

    const terrain = local.terrainAt(pt)
    const debug = local.debugSymbolMap.get(pt)
    const features = here.filter(e => e.feature)
    const items = here.filter(e => e.item)

    if (visible) {
      const beings = here.filter(e => e.being)
      if (terrain) stack.push(terrain)
      if (debug) stack.push(debug)
      stack.push(...features)
      stack.push(...items)
      stack.push(...beings)
    } else if (shrouded) {
      // area previously seen, render terrain and features
      stack.push(terrain)
      stack.push(...features)
      if (debug) stack.push(debug)
      stack.push(...items)
      stack.push(shroudedFog)
    } else {
      // unrevealed area
      stack.push(terrain)
      if (debug) stack.push(debug)
      stack.push(unrevealedFog)
    }

    // sort z-levels
    stack.sort((a, b) => zLevel(a) - zLevel(b))

    // extract relevant sprite, finding specific variants if applicable
    const renderStack: [string, string, string][] = stack.reduce((acc, e) => {
      const { base, ledge, ledgeOverlay, trigger, exposed, noise } = e.sprite
      let tile = e.sprite.base.tile
      let color = 'transparent'
      let bgColor = 'transparent'

      // liquid ledge tiles (top edge)
      if (ledge) {
        const tAbove = local.terrainAt(pt.north(1))
        if (tAbove.key !== e.key) {
          tile = ledge.tile
        }
      }

      // beings facing direction
      if (e.facing && e.sprite[e.facing]) {
        const s = e.sprite[e.facing]?.tile
        if (s) tile = s
      }

      // tag triggers (doors)
      if (trigger && base) {
        trigger.forEach((trig, i) => {
          if (trig in e) tile = base.tiles[i]
        })
      }

      // wall/floor/noise variants
      if (exposed || noise) {
        let sprite = base
        let i = 0
        if (exposed) {
          const tBelow = local.terrainAt(pt.south(1))
          if (!tBelow.wall) sprite = exposed
        }

        if (noise) {
          const len = base.tiles.length
          const v = local.noise.get(pt.x, pt.y)
          const vMod = Math.round(((v + 1) * 255) / 2) % len

          i = v <= noise[0] ? 0 : vMod
        }
        tile = sprite.tiles[i]
      }

      // render basic version of floor if unrevealed
      if (e.floor && !visible && !shrouded) {
        tile = base.tiles[0]
      }

      // return tile with shadow overlay
      if (ledgeOverlay) {
        const tAbove = local.terrainAt(pt.north(1))
        if (tAbove.key !== e.key) {
          return [...acc, [tile, color, bgColor], [ledgeOverlay.tile, color, bgColor]]
        }
      }

      // colors
      if (e.color) color = e.color
      if (e.bgColor) bgColor = e.bgColor

      return [...acc, [tile, color, bgColor]]
    }, [] as [string, string, string][])

    // draw
    mainDisplay.draw(
      viewPt.x,
      viewPt.y,
      renderStack.map(s => s[0]),
      renderStack.map(s => s[1]),
      renderStack.map(s => s[2])
    )
  }) // end viewport traverse
}

const zLevel = (e: Entity) => {
  if (e.renderLevelHigh) return 10
  if (e.being) return 7
  if (e.item) return 5
  if (e.feature) return 3
  return 0
}
