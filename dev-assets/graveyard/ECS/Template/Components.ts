import { name, position, form, tag, Form, Name, Position, Tag } from '../../../../src/Component'

export type Components = Partial<Name & Form & Tag>
// export type AComponent <T extends ComponentsType>=  { a: T['cID'] }
// export type Comp2 = { [key: ComponentsType['cID']]: ComponentsType}
export const ComponentFactory = {
  name,
  form,
  tag,
}
