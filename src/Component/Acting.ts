import { ActionTypes } from '../Action'

export type Acting = { acting: ActionTypes }
export const acting = (action: ActionTypes): Acting => {
  return { acting: action }
}
