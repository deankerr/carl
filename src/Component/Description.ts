export type Description = { description: { name: string } }
export const description = (name: string) => {
  return { description: { name } }
}
