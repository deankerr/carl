import { transformHSL } from '../lib/color'
import { logger } from '../lib/logger'
import { Point } from '../Model/Point'
import { BeingKey, beings, FeatureKey, features, TerrainKey, terrain } from '../Templates'
import { FoundryKey, Component, ComponentFoundry, FoundryParam, Components } from './Components'

export type eID = { eID: number; label: string }
export type Entity = eID & Component<'name'> & Component<'render'> & Partial<Components>
export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type EntityKey = BeingKey | FeatureKey | TerrainKey

export type EntityTemplate = {
  label: string
  name: FoundryParam['name']
} & Partial<FoundryParam>

const templates = [...beings, ...features, ...terrain]

export class EntityPool {
  private count = 0
  readonly pool = new Map<string, Entity>()

  constructor(readonly components: typeof ComponentFoundry) {
    const log = logger('entity', 'init')

    for (const t of templates) {
      let e = {
        eID: 0,
        label: t.label,
        ...components.name(...t.name),
        ...components.render('unknown'),
      }

      if (t.tiles) {
        e.render.char = t.tiles[0]
        e = { ...e, ...this.components.tiles(...t.tiles) }
      }

      if (t.tag) e = this.attach(e, 'tag', ...t.tag)
      if (t.trodOn) e = this.attach(e, 'trodOn', ...t.trodOn)
      if (t.fieldOfView) e = this.attach(e, 'fieldOfView', ...t.fieldOfView)

      if (t.tileTriggers) e = this.attach(e, 'tileTriggers', ...t.tileTriggers)
      if (t.tilesAutoCycle) e = this.attach(e, 'tilesAutoCycle', ...t.tilesAutoCycle)

      // if (t.emitLight) {
      //   const color =
      //     t.emitLight[0] === 'auto'
      //       ? transformHSL(e.render.color, { lum: { to: 0.1 } })
      //       : t.emitLight[0]
      //   e = this.attach(e, 'emitLight', color, t.emitLight[1])
      //   e = this.attach(e, 'tag', 'signalLightPathUpdated')
      // }

      // if (t.lightHueRotate) e = this.attach(e, 'lightHueRotate', ...t.lightHueRotate)

      if (t.tileVariant) e = this.attach(e, 'tileVariant', ...t.tileVariant)

      this.pool.set(t.label, e)
    }
    log.end()
  }

  attach<T extends FoundryKey>(e: Entity, componentName: T, ...p: FoundryParam[T]) {
    const c = Reflect.apply(this.components[componentName], undefined, p)
    // logger('entity', 'attach', `${componentName}`).msg(
    //   `attach ${e.label} ${componentName} [${[...p.values()]}]`
    // )
    return { ...e, ...c }
  }

  private thaw(key: EntityKey) {
    const thawed = this.pool.get(key)
    if (!thawed) throw new Error(`Could not thaw entity ${key}`)
    return thawed
  }
  // create a new instance of an entity with a position
  spawn(key: EntityKey, at: Point) {
    const eID = this.count++
    const label = key + '-' + eID
    const e = { ...this.thaw(key), eID, label, ...this.components.position(at) }
    return e
  }

  // return the base copy of the entity (ie. for terrain)
  symbolic(key: EntityKey) {
    return this.thaw(key)
  }

  // region entity manager
  entity(localState: Entity[], entity: Entity) {
    const index = localState.findIndex(e => e === entity)
    if (index < 0) throw new Error(`Unable to locate entity to modify ${entity.label}`)
    let store = entity

    const modify = <T extends FoundryKey>(cName: T, ...p: FoundryParam[T]) => {
      store = this.attach(store, cName, ...p)
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
}
