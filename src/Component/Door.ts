export type Door = { door: { open: boolean } }
export const door = (open = false) => {
  return { door: { open } }
}
