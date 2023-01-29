import { Point } from '../Model/Point'
import { Comp, Complist, ComponentFoundary, TagKeys } from './Components'
export type eID = { eID: number; label: string }
export type Entity = eID & Comp<'form'> & Comp<'tag'> & Partial<Complist>
export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type EntityR = Entity & Required<Comp<'form'>> & Comp<'position'>

export class EntityHive {
  private count = 0
  readonly clones = new Map<string, Entity>()
  constructor(readonly components: typeof ComponentFoundary) {}

  load(templates: EntityTemplate, tag?: TagKeys) {
    for (const [key, template] of Object.entries(templates)) {
      let e = { eID: 0, label: key, ...this.components.tag(), ...this.components.form('', '', '') }

      if (template.form) e = { ...e, ...this.components.form(...template.form) }

      if (template.tag) {
        const tags = tag ? template.tag.concat(tag) : template.tag
        e = { ...e, ...this.components.tag(...tags) }
      }

      if (template.trodOn) e = { ...e, ...this.components.trodOn(...template.trodOn) }

      this.clones.set(key, e)
    }
  }

  spawn(key: EntityKey, at: Point): Entity {
    const thawed = this.clones.get(key)
    if (!thawed) throw new Error(`Could not thaw entity ${key}`)
    const e = { ...thawed, eID: this.count++, ...this.components.position(at) }
    return e as Entity
  }
}

type EntityTemplate = {
  [key: string]: Partial<{
    [Key in keyof typeof ComponentFoundary]: Parameters<typeof ComponentFoundary[Key]>
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
  void: { form: ['void', 'void', '#FF00FF'] },
  endlessVoid: { form: ['endless void', 'void', '#FF00FF'], tag: ['blocksLight', 'blocksMovement'] },
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
  | 'void'
  | 'endlessVoid'

export const beings: EntityTemplate = {
  player: { form: ['player', '@', '#EE82EE'], tag: ['playerControlled'] },
  spider: { form: ['spider', 'spider', '#00B3B3'] },
}
type BeingKey = 'player' | 'spider'

export const features: EntityTemplate = {
  shrub: { form: ['shrub', 'shrub', '#58a54a'], tag: ['memorable'] },
}
type FeatureKey = 'shrub'
