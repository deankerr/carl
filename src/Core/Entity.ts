import { Comp, Complist, ComponentFoundry } from './Components'
export type eID = { eID: number; label: string }
export type Entity = eID & Comp<'name'> & Comp<'form'> & Partial<Complist>
export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }

type FoundaryParams = { [K in keyof typeof ComponentFoundry]: Parameters<typeof ComponentFoundry[K]> }

type EntityTemplate = {
  label: string
  name: FoundaryParams['name']
  form: FoundaryParams['form']
} & Partial<FoundaryParams>

export class EntityPool {
  private count = 0
  readonly pool = new Map<string, Entity>()

  constructor(readonly apply: typeof ComponentFoundry, templates: EntityTemplate[]) {
    for (const t of templates) {
      let e = {
        eID: 0,
        label: t.label,
        ...apply.name(...t.name),
        ...apply.form(...t.form),
      }

      if (t.tag) e = { ...e, ...apply.tag(...t.tag) }
      if (t.trodOn) e = { ...e, ...apply.trodOn(...t.trodOn) }

      this.pool.set(t.label, e)
    }
  }

  // spawn(key: EntityIDs, at: Point): Entity {
  //   const thawed = this.clones.get(key)
  //   if (!thawed) throw new Error(`Could not thaw entity ${key}`)
  //   const e = { ...thawed, eID: this.count++, ...this.components.position(at) }
  //   return e as Entity
  // }
}

export const beings: EntityTemplate[] = [
  { label: 'player', name: ['player'], form: ['@', '#EE82EE'], tag: ['playerControlled', 'actor'] },
  { label: 'spider', name: ['spider'], form: ['spider', '#00B3B3'], tag: ['actor'] },
]
export type BeingLabels = 'player' | 'spider'

export const features: EntityTemplate[] = [
  { label: 'shrub', name: ['shrub'], form: ['shrub', '#58a54a'], tag: ['memorable'] },
]
export type FeatureLabels = 'shrub'

export const terrain: EntityTemplate[] = [
  { label: 'path', name: ['path'], form: ['path', '#262626'] },
  { label: 'wall', name: ['wall'], form: ['wall', '#767676'], tag: ['blocksMovement', 'blocksLight'] },
  { label: 'water', name: ['water'], form: ['water', '#4084bf'], trodOn: ['You tread water.'] },
  { label: 'stairsDown', name: ['descending stairs'], form: ['stairsDown', '#767676'] },
  { label: 'stairsUp', name: ['ascending'], form: ['stairsUp', '#767676'] },
  {
    label: 'crackedWall',
    name: ['cracked wall'],
    form: ['crackedWall', '#767676'],
    tag: ['blocksMovement', 'blocksLight'],
  },
  { label: 'grass', name: ['grass'], form: ['grass', '#65712b'] },
  { label: 'deadGrass', name: ['dead grass'], form: ['deadGrass', '#664f47'] },
  { label: 'mound', name: ['mound'], form: ['mound', '#6a4b39'], tag: ['blocksLight'] },
  { label: 'void', name: ['void'], form: ['void', '#FF00FF'] },
  { label: 'endlessVoid', name: ['endless void'], form: ['void', '#FF00FF'], tag: ['blocksLight', 'blocksMovement'] },
]
export type TerrainLabels =
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

export type EntityLabels = BeingLabels | FeatureLabels | TerrainLabels

export const gameTemplates = [...beings, ...features, ...terrain]
