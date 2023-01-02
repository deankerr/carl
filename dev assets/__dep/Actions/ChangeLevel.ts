export interface ChangeLevel {
  changeLevel: number
}

export function ChangeLevel(changeLevel: number): ChangeLevel {
  return { changeLevel }
}
