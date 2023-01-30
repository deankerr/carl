import { ActionTypes } from '../Action'
import { Point } from '../Model/Point'
import { Entity } from './Entity'

export type Comp<K extends keyof typeof ComponentFoundry> = ReturnType<typeof ComponentFoundry[K]>
export type Complist = Comp<'name'> & Comp<'form'> & Comp<'position'> & Comp<'tag'> & Comp<'trodOn'> & Comp<'acting'>

export type FoundryParams = { [K in keyof typeof ComponentFoundry]: Parameters<typeof ComponentFoundry[K]> }
export type Components = ReturnType<typeof ComponentFoundry[keyof typeof ComponentFoundry]>
export type CNames = keyof typeof ComponentFoundry

export const ComponentFoundry = {
  name: (name: string) => {
    return { name }
  },
  form: (char: string, color: string, bgColor = 'transparent') => {
    return { form: { char, color, bgColor } }
  },
  position: (pt: Point) => {
    return { position: { pt } }
  },
  tag: (...tags: TagKeys[]) => {
    return tags.reduce((acc, curr) => {
      return { ...acc, [curr]: true }
    }, {} as { [K in TagKeys]?: true })
  },
  trodOn: (msg: string) => {
    return { trodOn: { msg } }
  },
  acting: (action: ActionTypes) => {
    return { acting: action }
  },
}

export const mod = (e: Entity) => {
  const stored = e

  const add = (cName: keyof typeof ComponentFoundry) => {
    return (...p: FoundryParams[typeof cName]) => {
      // const c = ComponentFoundry[cName](...p)
      const c = Reflect.apply(ComponentFoundry[cName], undefined, p)
      console.log('c:', c)
      return { ...stored, ...c }
    }
  }

  return add

  // const addTag = (p: FoundryParams['tag']) => {
  //   const c = ComponentFoundry.tag(...p)
  // }
}

/*

  region.modify(player).add('tag')()


*/

export type TagKeys =
  | 'blocksMovement'
  | 'blocksLight'
  | 'playerControlled'
  | 'memorable'
  | 'actor'
  | 'meleeAttackTarget'
  | 'dead'
  | 'testTag'
