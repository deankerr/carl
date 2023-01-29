export type Name = { name: { cID: 'name'; name: string } }
export function name(name: string): Name {
  return { name: { cID: 'name', name } }
}
