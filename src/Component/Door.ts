import { Graphic } from './Graphic'

export type DoorGraphic = { doorGraphic: { closed: Graphic; open: Graphic } }
export const doorGraphic = (closed: Graphic, open: Graphic) => {
  return { doorGraphic: { closed, open } }
}
