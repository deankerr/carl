import { Entity } from '../Core/Entity'
import * as C from '../Component'
import { Point } from '../Model/Point'
import { Graphic, graphic } from '../Component'

export type FeatureTemplate = typeof Features[keyof typeof Features]

export const createFeature = (t: FeatureTemplate, pt: Point): Entity => {
  const { id, name, char, color } = t

  let entity = {
    id,
    name,
    char,
    color,
    ...C.position(pt),
  }

  if (t.walkable) entity = { ...entity, ...C.tagWalkable() }
  if (t.memorable) entity = { ...entity, ...C.tagMemorable() }
  if (t.trodOn) entity = { ...entity, ...C.trodOn(t.trodOn) }

  if ('cycleGraphic' in t) {
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

export const Features = {
  shrub: {
    id: 'shrub',
    name: 'shrub',
    char: 'shrub',
    color: '#58a54a',
    walkable: true,
    memorable: true,
    trodOn: 'You trample the pathetic shrub.',
  },
  flames: {
    id: 'flames',
    name: 'flames',
    char: 'flames1',
    color: '#fc7703',
    walkable: true,
    memorable: false,
    trodOn: 'You begin to crisp up nicely while standing in the flames.',
    cycleGraphic: ['flames1', 'flames2'],
    emitLight: true,
  },
  blueFlames: {
    id: 'blueflames',
    name: 'blue flames',
    char: 'flames1',
    color: '#141cff',
    walkable: true,
    memorable: false,
    trodOn: 'You begin to crisp up nicely while standing in the flames.',
    cycleGraphic: ['flames1', 'flames2'],
    emitLight: true,
  },
  greenFlames: {
    id: 'greenflames',
    name: 'green flames',
    char: 'flames1',
    color: '#0df20d',
    walkable: true,
    memorable: false,
    trodOn: 'You begin to crisp up nicely while standing in the flames.',
    cycleGraphic: ['flames1', 'flames2'],
    emitLight: true,
  },
}
