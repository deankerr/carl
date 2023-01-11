export type ChangeLevel = { changeLevel: { to: string } }

export const ChangeLevel = (to: string) => {
  return { changeLevel: { to } }
}
