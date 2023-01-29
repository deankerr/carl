export type FOV = { fov: { radius: number; visible: string[] } }
export const fov = (radius: number): FOV => {
  return { fov: { radius, visible: [] } }
}
