import { Point } from '../Model/Point'
import { FoundryKey, Component, ComponentFoundry, FoundryParam, Components } from './Components'
export type eID = { eID: number; label: string }
export type Entity = eID & Component<'name'> & Component<'form'> & Partial<Components>
export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }

type EntityTemplate = {
  label: string
  name: FoundryParam['name']
  form: FoundryParam['form']
} & Partial<FoundryParam>

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

  add<T extends FoundryKey>(e: Entity, componentName: T, ...p: FoundryParam[T]) {
    const c = Reflect.apply(this.components[componentName], undefined, p)
    return { ...e, ...c } as EntityWith<Entity, 'trodOn'>
  }

  private thaw(key: EntityKey) {
    const thawed = this.pool.get(key)
    if (!thawed) throw new Error(`Could not thaw entity ${key}`)
    return thawed
  }
  // create a new instance of an entity with a position
  spawn(key: EntityKey, at: Point) {
    const e = { ...this.thaw(key), eID: this.count++, ...this.components.position(at) }
    return e
  }

  // return the base copy of the entity (ie. for terrain)
  symbolic(key: EntityKey) {
    return this.thaw(key)
  }

  entity(localState: Entity[], entity: Entity) {
    const index = localState.findIndex(e => e === entity)
    if (index < 0) throw new Error(`Unable to locate entity to modify, ${entity.label}`)
    let store = entity

    const modify = <T extends FoundryKey>(cName: T, ...p: FoundryParam[T]) => {
      store = this.add(store, cName, ...p)
      localState[index] = store
      console.log('MODIFY:', store.name, cName, p)
      return options
    }

    const remove = <T extends keyof Components>(cName: T) => {
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

export type BeingKey = 'player' | 'spider' | 'ghost' | 'demon' | 'crab' | 'crab2'
export const beings: EntityTemplate[] = [
  {
    label: 'player',
    name: ['player'],
    form: ['@', '#EE82EE'],
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being'],
  },
  { label: 'spider', name: ['spider'], form: ['spider', '#00B3B3'], tag: ['actor', 'blocksMovement', 'being'] },
  { label: 'ghost', name: ['ghost'], form: ['ghost', '#FFFFFF'], tag: ['actor', 'blocksMovement', 'being'] },
  {
    label: 'demon',
    name: ['Natas, the mysterious wanderer'],
    form: ['demon', '#FF0000'],
    tag: ['actor', 'blocksMovement', 'being'],
  },
  { label: 'crab', name: ['crab'], form: ['crab', '#cc3131'], tag: ['actor', 'blocksMovement', 'being'] },
  { label: 'crab2', name: ['turncoat crab'], form: ['crab', '#32cd44'], tag: ['actor', 'blocksMovement', 'being'] },
]

export type FeatureKey = 'shrub' | 'statue' | 'tombstone' | 'flames' | 'deadTree'
export const features: EntityTemplate[] = [
  { label: 'shrub', name: ['shrub'], form: ['shrub', '#58a54a'], tag: ['memorable', 'feature'] },
  {
    label: 'statue',
    name: ['statue'],
    form: ['statue', '#adadad'],
    tag: ['memorable', 'feature', 'blocksLight', 'blocksMovement'],
  },
  {
    label: 'tombstone',
    name: ['tombstone'],
    form: ['tombstone', '#9c9c9c'],
    tag: ['memorable', 'feature'],
    trodOn: ['You bow your head solemnly in thoughtful prayer.'],
  },
  {
    label: 'deadTree',
    name: ['dead tree'],
    form: ['tree', '#602e15'],
    tag: ['memorable', 'feature', 'blocksLight'],
  },
  { label: 'flames', name: ['flames'], form: ['flames1', '#FF8000'], tag: ['memorable', 'feature'] },
]

export type TerrainKey =
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
  | 'peak'
export const terrain: EntityTemplate[] = [
  { label: 'path', name: ['path'], form: ['path', '#262626'], tag: ['terrain'] },
  { label: 'wall', name: ['wall'], form: ['wall', '#767676'], tag: ['blocksMovement', 'blocksLight', 'terrain'] },
  { label: 'water', name: ['water'], form: ['water', '#4084bf'], tag: ['terrain'], trodOn: ['You tread water.'] },
  { label: 'stairsDown', name: ['descending stairs'], form: ['stairsDown', '#767676'], tag: ['terrain'] },
  { label: 'stairsUp', name: ['ascending'], form: ['stairsUp', '#767676'], tag: ['terrain'] },
  {
    label: 'crackedWall',
    name: ['cracked wall'],
    form: ['crackedWall', '#767676'],
    tag: ['blocksMovement', 'blocksLight', 'terrain'],
  },
  { label: 'grass', name: ['grass'], form: ['grass', '#65712b'], tag: ['terrain'] },
  { label: 'deadGrass', name: ['dead grass'], form: ['deadGrass', '#664f47'], tag: ['terrain'] },
  { label: 'mound', name: ['mound'], form: ['mound', '#6a4b39'], tag: ['blocksLight', 'terrain'] },
  { label: 'peak', name: ['peak'], form: ['peak', '#2a5a3e'], tag: ['blocksLight', 'terrain'] },
  { label: 'void', name: ['void'], form: ['void', '#FF00FF'], tag: ['terrain'] },
  {
    label: 'endlessVoid',
    name: ['endless void'],
    form: ['void', '#FF00FF'],
    tag: ['blocksLight', 'blocksMovement', 'terrain'],
  },
]

export type EntityKey = BeingKey | FeatureKey | TerrainKey

export const gameTemplates = [...beings, ...features, ...terrain]
