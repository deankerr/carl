import * as ROT from 'rot-js'
import { Beings, Features, Terrain } from '../../../../src/Templates'

const hex = (c: string) => ROT.Color.toHex(ROT.Color.fromString(c))

export const createWordRegex = (val: string) => {
  return new RegExp(`\\b${val}\\b`, 'gi')
}

type EntityColorPair = [string, string]

type ECMTemplates = typeof Beings | typeof Features | typeof Terrain
function deriveEntityColorMap<T extends ECMTemplates>(list: T): EntityColorPair[] {
  const entries = Object.entries(list)
  return entries.map(e => [e[1].name, hex(e[1].color)])
}

// sorted mapping of entity name Regex, name, color
// [name, color]
const entityColorMap: EntityColorPair[] = [
  ...deriveEntityColorMap(Beings),
  ...deriveEntityColorMap(Features),
  ...deriveEntityColorMap(Terrain),
  ['door', '#73513d'] as EntityColorPair,
].sort((a, b) => {
  const nameA = a[0]
  const nameB = b[1]
  return nameB.length - nameA.length
})

export type Message = {
  turn: number
  raw: string
  colors: EntityColorPair[]
}

// for each entity in the game, find their name in the message
// return a list of relevant 'name' to 'color' mappings if relevant
export function colorizeMessage(msg: string) {
  let searchString = msg
  const matchedTextColor: EntityColorPair[] = []

  for (const entity of entityColorMap) {
    const matches = [...msg.matchAll(createWordRegex(entity[0]))]
    matches.forEach(() => {
      matchedTextColor.push(entity)
      // replace match substring with spaces to avoid rematching a substring
      searchString = searchString.replaceAll(entity[0], ' '.repeat(entity[0].length))
    })
  }

  return matchedTextColor
}
