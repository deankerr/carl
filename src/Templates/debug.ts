import { EntityTemplate } from '../Core'

export type DebugKeys =
  | 'debug0'
  | 'debug1'
  | 'debug2'
  | 'debug3'
  | 'debug4'
  | 'debug5'
  | 'debug6'
  | 'debug7'
  | 'debug8'
  | 'debug9'

export const debug: EntityTemplate[] = [...makeDebugs('0123456789')]

function makeDebugs(s: string): EntityTemplate[] {
  const a = s.split('')
  const ts: EntityTemplate[] = []
  a.forEach(name => {
    const t = {
      label: 'debug' + name,
      name: ['debug'],
      form: ['debug', '', ''],
      tag: ['feature', 'renderUnderBeing', 'memorable'],
      trodOn: ['you touch the bugs'],
    } as EntityTemplate
    t.form[0] = name
    ts.push(t)
  })
  return ts
}
