import { Point } from '../lib/Shape/Point'
import { beings, features, items, terrain } from '../Templates'
import { Component, ComponentFoundry, Components, FoundryKey, FoundryParam } from './Components'
import { SpriteConfig, SpriteManager } from './Sprite'

const templates = { ...beings, ...features, ...terrain, ...items }

export type eID = { eID: number; label: string; key: EntityKey }
export type Entity = eID & Component<'name'> & Component<'sprite'> & Partial<Components>
export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type TerrainKey = keyof typeof terrain
export type FeatureKey = keyof typeof features
export type BeingKey = keyof typeof beings
export type ItemKey = keyof typeof items
export type EntityKey = TerrainKey | FeatureKey | BeingKey | ItemKey

export type EntityTemplate = {
  name: string
  sprite: SpriteConfig
  tag: FoundryParam['tag']
} & Partial<Omit<FoundryParam, 'name' | 'sprite'>>

export class EntityPool {
  private eID = 0
  readonly C = ComponentFoundry
  readonly pool = new Map<string, Entity>()
  readonly live = new WeakSet<Entity>()

  constructor(readonly sprites: SpriteManager) {
    const C = this.C

    for (const [key, t] of Object.entries(templates)) {
      let e = {
        eID: 0,
        label: key,
        key: key as EntityKey,
        ...C.name(t.name),
        ...C.sprite(this.sprites, t.sprite),
        ...C.tag(...t.tag),
      }

      if ('trodOn' in t) e = { ...e, ...C.trodOn(...t.trodOn) }
      if ('bumpMessage' in t) e = { ...e, ...C.bumpMessage(...t.bumpMessage) }
      if ('fieldOfView' in t) e = { ...e, ...C.fieldOfView(...t.fieldOfView) }
      if ('portal' in t) e = { ...e, ...C.portal(t.portal[0], t.portal[1]) }

      this.pool.set(key, e)
    }
  }

  // attach<T extends FoundryKey>(e: Entity, componentName: T, ...p: FoundryParam[T]) {
  //   const c = Reflect.apply(this.C[componentName], undefined, p)
  //   // logger('entity', 'attach', `${componentName}`).msg(
  //   //   `attach ${e.label} ${componentName} [${[...p.values()]}]`
  //   // )
  //   return { ...e, ...c }
  // }

  private thaw(key: EntityKey) {
    const thawed = this.pool.get(key)
    if (!thawed) throw new Error(`Could not thaw entity ${key}`)
    return thawed
  }

  // create a new instance of an entity with a position
  spawn(key: EntityKey, at: Point) {
    const eID = this.eID++
    const label = key + '-' + eID
    let e = { ...this.thaw(key), eID, label, ...this.C.position(at) }

    if (e.sprite?.type === 'random') {
      const tKey = templates[key]
      if ('sprite' in tKey) {
        e = { ...e, ...this.C.sprite(this.sprites, tKey.sprite) }
      }
    }

    this.live.add(e)
    return e
  }

  // return the base copy of the entity (ie. for terrain)
  symbolic(key: EntityKey) {
    return this.thaw(key)
  }

  attachName<T extends FoundryKey>(e: Entity, name: T, ...p: FoundryParam[T]): Entity {
    if (!this.C[name]) throw new Error('Invalid component name')
    const c = Reflect.apply(this.C[name], undefined, p) as Component<T>
    const e2 = Object.assign(e, c)
    return e2
  }

  attach<T extends Partial<Components>>(e: Entity, ...com: T[]) {
    Object.assign(e, ...com)
  }

  // region entity manager
  entity(localState: Entity[], entity: Entity) {
    const index = localState.findIndex(e => e === entity)
    if (index < 0) throw new Error(`Unable to locate entity to modify ${entity.label}`)
    let store = entity

    const modify = <T extends FoundryKey>(cName: T, ...p: FoundryParam[T]) => {
      store = this.attachName(store, cName, ...p)
      localState[index] = store
      return options
    }

    const remove = <T extends keyof Components>(componentName: T) => {
      const e = { ...store }
      Reflect.deleteProperty(e, componentName)
      store = e
      localState[index] = store
      // logger('entity', 'remove', `${componentName}`).msg(`remove ${e.label} ${componentName}`)
      return options
    }

    const options = { modify, remove }

    return options
  }

  modify(e: Entity) {
    const entity = e

    const attach = <T extends Partial<Components>>(e: Entity, ...com: T[]) => {
      Object.assign(e, ...com)
      return options
    }

    const define = <T extends FoundryKey>(comName: T, ...p: FoundryParam[T]) => {
      this.attachName(entity, comName, ...p)
      return options
    }

    const remove = <T extends keyof Components>(comName: T) => {
      Reflect.deleteProperty(entity, comName)
      return options
    }

    const options = { attach, define, remove, entity }
    return options
  }
}
