export type Form = { form: { cID: 'form'; char: string; color: string; bgColor: string } }
export function form(char: string, color: string, bgColor = 'transparent'): Form {
  return { form: { cID: 'form', char, color, bgColor } }
}
