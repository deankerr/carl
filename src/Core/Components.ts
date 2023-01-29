import { Point } from '../Model/Point'

export type Components = ReturnType<typeof ComponentsFactory[keyof typeof ComponentsFactory]>
export type CKey = keyof typeof ComponentsFactory
export type Comp<K extends CKey> = ReturnType<typeof ComponentsFactory[K]>
type a = Comp<'form'>
export const ComponentsFactory = {
  form: (name: string, char: string, color: string, bgColor = 'transparent') => {
    return { form: { name, char, color, bgColor } }
  },
  position: (pt: Point) => {
    return { position: { pt } }
  },
  tag: (...tags: Tags[]) => {
    return { tags: { tags } }
  },
  trodOn: (msg: string) => {
    return { trodOn: { msg } }
  },
}

export type Tags = 'blocksMovement' | 'blocksLight' | 'playerControlled' | 'memorable' | 'actor'
