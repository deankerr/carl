/* generate - handles the level generator(s), returning only what we need
 might be unnecessary but I hated how much level data specific typing ended
 up in the main game functions

 later, something like: function generateLevel(Enum.Dungeon) {} ?
 */
// const max = 5
import { Grid } from '../Core/Grid'
import { create } from './dungeon4/'

export function dungeon4() {
  const data = create()
  if (!data) throw new Error('Dungeon gen failed.')

  return Grid.from(data[0])
}
