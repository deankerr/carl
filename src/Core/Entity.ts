import { transformHSL } from '../lib/color'
import { logger } from '../lib/logger'
import { Point } from '../Model/Point'
import { BeingKey, beings, FeatureKey, features, TerrainKey, terrain } from '../Templates'
import { FoundryKey, Component, ComponentFoundry, FoundryParam, Components } from './Components'

export type eID = { eID: number; label: string }
export type Entity = eID & Component<'name'> & Component<'form'> & Partial<Components>
export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type EntityKey = BeingKey | FeatureKey | TerrainKey

export type EntityTemplate = {
  label: string
  name: FoundryParam['name']
  form: FoundryParam['form']
} & Partial<FoundryParam>

export class EntityPool {
  private count = 0
  readonly pool = new Map<string, Entity>()

  constructor(readonly components: typeof ComponentFoundry) {
    const log = logger('entity', 'init')
    const templates = [...beings, ...features, ...terrain]
    for (const t of templates) {
      let e = {
        eID: 0,
        label: t.label,
        ...components.name(...t.name),
        ...components.form(...t.form),
      }

      if (t.tag) e = this.attach(e, 'tag', ...t.tag)
      if (t.trodOn) e = this.attach(e, 'trodOn', ...t.trodOn)
      if (t.fieldOfView) e = this.attach(e, 'fieldOfView', ...t.fieldOfView)
      if (t.formSet) e = this.attach(e, 'formSet', ...t.formSet)
      if (t.formSetTriggers) e = this.attach(e, 'formSetTriggers', ...t.formSetTriggers)
      if (t.formSetAutoCycle) e = this.attach(e, 'formSetAutoCycle', ...t.formSetAutoCycle)

      if (t.emitLight) {
        const color =
          t.emitLight[0] === 'auto'
            ? transformHSL(e.form.color, { lum: { to: 0.25 } })
            : t.emitLight[0]
        e = this.attach(e, 'emitLight', color, t.emitLight[1])
      }

      if (t.lightFlicker) e = this.attach(e, 'lightFlicker', ...t.lightFlicker)
      if (t.lightHueRotate) e = this.attach(e, 'lightHueRotate', ...t.lightHueRotate)

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
