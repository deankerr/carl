import { ActionTypes } from '../Action'
import { Point } from '../Model/Point'

export type CKey = keyof typeof ComponentFoundary
export type Comp<K extends CKey> = ReturnType<typeof ComponentFoundary[K]>
export type Complist = Comp<'form'> & Comp<'position'> & Comp<'tag'> & Comp<'trodOn'> & Comp<'acting'>
export type Components = ReturnType<typeof ComponentFoundary[keyof typeof ComponentFoundary]>
// export type Components = Partial<Form & Position & Tags & TrodOn>
// export type Form = { form: { name: string; char: string; color: string; bgColor: string } }
// export type Position = { position: { pt: Point } }
// export type Tags = { tags: TagKeys[] }
// export type TrodOn = { trodOn: { msg: string } }
export const ComponentFoundary = {
  form: (name: string, char: string, color: string, bgColor = 'transparent') => {
    return { form: { name, char, color, bgColor } }
  },
  position: (pt: Point) => {
    return { position: { pt } }
  },
  tag: (...tags: TagKeys[]) => {
    return { tags }
  },
  trodOn: (msg: string) => {
    return { trodOn: { msg } }
  },
  acting: (action: ActionTypes) => {
    return { acting: action }
  },
}

export type TagKeys = 'blocksMovement' | 'blocksLight' | 'playerControlled' | 'memorable' | 'actor'
