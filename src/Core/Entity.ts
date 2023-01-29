import { Point } from '../Model/Point'
import { Comp, Components, ComponentsFactory, Tags } from './Components'

export type Entity = { eID: number } & Partial<Components>
// export type Entity = BareEntity & Required<ReturnType<typeof ComponentsFactory['form' | 'position']>>
export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
// export type Entity = { eID: number } & ReturnType<typeof ComponentsFactory['form']> &
// ReturnType<typeof ComponentsFactory['position']>

export class EntityFreezer {
  private count = 0
  readonly freezer = new Map<string, Entity>()
  constructor(readonly components: typeof ComponentsFactory) {}
  load(templates: EntityTemplate, tag?: Tags) {
    for (const [key, template] of Object.entries(templates)) {
      let e = { eID: 0 }

      if (template.form) e = { ...e, ...this.components.form(...template.form) }
      if (template.trodOn) e = { ...e, ...this.components.trodOn(...template.trodOn) }
      if (template.tag) {
        const tags = tag ? template.tag.concat(tag) : template.tag
        e = { ...e, ...ComponentsFactory.tag(...tags) }
      }
      this.freezer.set(key, e)
    }
  }

  spawn(key: EntityKey, at: Point): Entity {
    const thawed = this.freezer.get(key) as EntityWith<Entity, keyof Comp<'form'>>
    if (!thawed) throw new Error(`Could not thaw entity ${key}`)
    const e = { ...thawed, eID: this.count++, ...this.components.position(at) }
    return e as Entity
  }
}

type EntityTemplate = {
  [key: string]: Partial<{
    [Key in keyof typeof ComponentsFactory]: Parameters<typeof ComponentsFactory[Key]>
  }>
}

export type EntityKey = TerrainKey | BeingKey | FeatureKey

export const terrain: EntityTemplate = {
  path: { form: ['path', 'path', '#262626'] },
  wall: { form: ['wall', 'wall', '#767676'], tag: ['blocksMovement', 'blocksLight'] },
  water: { form: ['water', 'water', '#4084bf'] },
  stairsDown: { form: ['stairs down', 'stairsDown', '#767676'] },
  stairsUp: { form: ['stairs up', 'stairsUp', '#767676'] },
  crackedWall: {
    form: ['cracked wall', 'crackedWall', '#767676'],
    tag: ['blocksMovement', 'blocksLight'],
  },
  grass: { form: ['grass', 'grass', '#65712b'] },
  deadGrass: { form: ['dead grass', 'deadGrass', '#664f47'] },
  mound: { form: ['mound', 'mound', '#6a4b39'], tag: ['blocksLight'] },
}
type TerrainKey =
  | 'path'
  | 'wall'
  | 'water'
  | 'stairsDown'
  | 'stairsUp'
  | 'crackedWall'
  | 'grass'
  | 'deadGrass'
  | 'mound'

export const beings: EntityTemplate = {
  player: { form: ['me', '@', '#EE82EE'], tag: ['playerControlled'] },
  spider: { form: ['spider', 'spider', '#00B3B3'] },
}
type BeingKey = 'player' | 'spider'

export const features: EntityTemplate = {
  shrub: { form: ['shrub', 'shrub', '#58a54a'], tag: ['memorable'] },
}
type FeatureKey = 'shrub'
