import { Point } from '../Model/Point'
import { CNames, Comp, Complist, ComponentFoundry, FoundryParams } from './Components'
export type eID = { eID: number; label: string }
export type Entity = eID & Comp<'name'> & Comp<'form'> & Partial<Complist>
export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }

type EntityTemplate = {
  label: string
  name: FoundryParams['name']
  form: FoundryParams['form']
} & Partial<FoundryParams>

export class EntityPool {
  private count = 0
  readonly pool = new Map<string, Entity>()

  constructor(readonly components: typeof ComponentFoundry, templates: EntityTemplate[]) {
    for (const t of templates) {
      let e = {
        eID: 0,
        label: t.label,
        ...components.name(...t.name),
        ...components.form(...t.form),
      }

      if (t.tag) e = this.add(e, 'tag', ...t.tag)
      if (t.trodOn) e = this.add(e, 'trodOn', ...t.trodOn)

      this.pool.set(t.label, e)
    }
  }

  add<T extends CNames>(e: Entity, componentName: T, ...p: FoundryParams[T]) {
    const c = Reflect.apply(this.components[componentName], undefined, p)
    return { ...e, ...c } as EntityWith<Entity, 'trodOn'>
  }

  spawn(key: EntityLabel, at: Point): Entity {
    const thawed = this.pool.get(key)
    if (!thawed) throw new Error(`Could not thaw entity ${key}`)
    const e = { ...thawed, eID: this.count++, ...this.components.position(at) }
    return e as Entity
  }

  entity(localState: Entity[], entity: Entity) {
    const index = localState.findIndex(e => e === entity)
    if (index < 0) throw new Error(`Unable to locate entity to modify, ${entity.label}`)
    let store = entity

    const modify = <T extends CNames>(cName: T, ...p: FoundryParams[T]) => {
      store = this.add(store, cName, ...p)
      localState[index] = store
      console.log('MODIFY:', store.name, cName, p)
      return options
    }

    const remove = <T extends keyof Complist>(cName: T) => {
      const e = { ...store }
      Reflect.deleteProperty(e, cName)
      store = e
      localState[index] = store
      console.log('REMOVE:', store.name, cName)
      return options
    }

    const options = { modify, remove }

    return options
  }
}

export type BeingLabel = 'player' | 'spider'
export const beings: EntityTemplate[] = [
  { label: 'player', name: ['player'], form: ['@', '#EE82EE'], tag: ['playerControlled', 'actor', 'blocksMovement'] },
  { label: 'spider', name: ['spider'], form: ['spider', '#00B3B3'], tag: ['actor', 'blocksMovement'] },
]

export type FeatureLabel = 'shrub'
export const features: EntityTemplate[] = [
  { label: 'shrub', name: ['shrub'], form: ['shrub', '#58a54a'], tag: ['memorable'] },
]

export type TerrainLabel =
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

export type EntityLabel = BeingLabel | FeatureLabel | TerrainLabel

export const gameTemplates = [...beings, ...features, ...terrain]
