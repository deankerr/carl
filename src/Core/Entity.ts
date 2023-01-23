import { Components } from './Components'
import * as C from '../Component'
import { Point } from '../Model/Point'
import { BeingTemplate, FeatureTemplate, TerrainTemplate } from '../Templates'
import { transformHSL } from '../lib/color'

export type EntityID = { readonly id: string; name: string; char: string; color: string }

export type Entity = EntityID & Components

export type EntityTemplate = BeingTemplate | FeatureTemplate | TerrainTemplate

export function hydrate(t: EntityTemplate, pt?: Point, fov?: number): Entity {
  let entity = {
    id: t.id,
    name: t.name,
    char: t.char,
    color: t.color,
  }

  if (pt) entity = { ...entity, ...C.position(pt) }
  if (fov) entity = { ...entity, ...C.fov(fov) }

  // TODO map components to templates to avoid doing this manually
  if ('tag' in t) {
    if (t.tag.includes('walkable')) entity = { ...entity, ...C.tagWalkable() }
    if (t.tag.includes('memorable')) entity = { ...entity, ...C.tagMemorable() }
    if (t.tag.includes('blocksLight')) entity = { ...entity, ...C.tagBlocksLight() }
    if (t.tag.includes('actor')) entity = { ...entity, ...C.tagActor() }
    if (t.tag.includes('player')) entity = { ...entity, ...C.tagPlayer() }
    if (t.tag.includes('door')) {
      entity = {
        ...entity,
        ...C.tagDoor(),
        ...C.doorGraphic(C.graphic('doorClosed', entity.color), C.graphic('doorOpen', entity.color)),
      }
    }
  }

  if ('trodOn' in t) entity = { ...entity, ...C.trodOn(t.trodOn) }

  if ('cycleGraphic' in t) {
    const list = t.cycleGraphic.list.map(g => {
      return C.graphic(g, t.color)
    })
    entity = { ...entity, ...C.cycleGraphic(list, t.cycleGraphic.frequency) }
  }

  if ('emitLight' in t) {
    // const color = 'color' in t.emitLight ? t.emitLight.color : transformHSL(entity.color, {lum: {to: .25}})
    // hardcoded to 25% of entity's luminance for now
    const color = transformHSL(entity.color, { lum: { to: 0.25 } })
    entity = { ...entity, ...C.emitLight(color, t.emitLight.flicker) }
  }

  return entity
}
