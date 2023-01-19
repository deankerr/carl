import { Components } from './Components'
import * as C from '../Component'
import { Point } from '../Model/Point'
import { BeingTemplate, FeatureTemplate, TerrainTemplate } from '../Templates'

export type EntityID = { readonly id: string; name: string; char: string; color: string }

export type Entity = EntityID & Components

export type EntityTemplate = BeingTemplate | FeatureTemplate | TerrainTemplate

export type EntityTemplates = {
  player?: Point
  beings: [BeingTemplate, Point | 0][]
  features: [FeatureTemplate, Point | 0][]
  doors: Point[]
}

export const createTemplates = (): EntityTemplates => {
  return { beings: [], features: [], doors: [] }
}

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

  if ('cycleGraphic' in t && Array.isArray(t.cycleGraphic)) {
    const cycle = t.cycleGraphic.map(g => {
      return C.graphic(g, t.color)
    }) as C.Graphic[]
    entity = { ...entity, ...C.cycleGraphic(cycle) }
  }

  if ('emitLight' in t) {
    entity = { ...entity, ...C.emitLight(entity.color) }
  }

  return entity
}
