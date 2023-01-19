import { Components } from './Components'
import * as C from '../Component'
import { Point } from '../Model/Point'
import { Graphic, graphic } from '../Component'
import { BeingTemplate } from '../Templates'
import { FeatureTemplate } from '../Templates/Features'
import { TerrainTemplate } from '../Templates/Terrain'

export type EntityID = { readonly id: string; name: string; char: string; color: string }

export type Entity = EntityID & Components

export type EntityTemplates = {
  player?: Point
  beings: [BeingTemplate, Point | 0][]
  features: [FeatureTemplate, Point | 0][]
  doors: Point[]
}
export type ETemplate = BeingTemplate | FeatureTemplate | TerrainTemplate

export const createTemplates = (): EntityTemplates => {
  return { beings: [], features: [], doors: [] }
}

export const createDoor = (pt: Point) => {
  return {
    id: 'door',
    ...C.position(pt),
    ...C.baseGraphic('O+', '#73513d'),
    ...C.name('door'),
    ...C.tagDoor(),
    ...C.doorGraphic(graphic('O+', '#73513d'), graphic('O/', '#73513d')),
    // ...C.trodOn('You carefully navigate through the door.'),
    ...C.tagBlocksLight(),
    ...C.tagMemorable(),
  }
}

export function hydrate(t: ETemplate, pt?: Point, fov?: number): Entity {
  const { id, name, char, color } = t

  let entity = {
    id,
    name,
    char,
    color,
  }

  if (pt) entity = { ...entity, ...C.position(pt) }
  if (fov) entity = { ...entity, ...C.fov(fov) }

  // TODO map components to templates to avoid doing this manually
  if ('tag' in t) {
    console.log(t.name, t.tag, t.tag.includes('walkable'))
    if (t.tag.includes('walkable')) entity = { ...entity, ...C.tagWalkable() }
    if (t.tag.includes('memorable')) entity = { ...entity, ...C.tagMemorable() }
    if (t.tag.includes('blocksLight')) entity = { ...entity, ...C.tagBlocksLight() }
    if (t.tag.includes('actor')) entity = { ...entity, ...C.tagActor() }
    if (t.tag.includes('player')) entity = { ...entity, ...C.tagPlayer() }
  }

  if ('trodOn' in t) entity = { ...entity, ...C.trodOn(t.trodOn) }

  if ('cycleGraphic' in t && Array.isArray(t.cycleGraphic)) {
    const cycle = t.cycleGraphic.map(g => {
      return graphic(g, color)
    }) as Graphic[]
    entity = { ...entity, ...C.cycleGraphic(cycle) }
  }

  if ('emitLight' in t) {
    entity = { ...entity, ...C.emitLight(entity.color) }
  }

  return entity
}
