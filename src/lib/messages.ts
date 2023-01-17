import * as ROT from 'rot-js'
import { templates } from '../Core/Entity'
import { terrainTemplates } from '../Core/Terrain'

const hex = (c: string) => ROT.Color.toHex(ROT.Color.fromString(c))

export const createWordRegex = (val: string) => {
  return new RegExp(`\\b${val}\\b`, 'gi')
}

type EntityColorPair = [string, string]

function deriveEntityColorMap<T extends typeof templates | typeof terrainTemplates>(list: T): EntityColorPair[] {
  const entries = Object.entries(list)
  return entries.map(e => [e[1][0], hex(e[1][2])])
}

// sorted mapping of entity name Regex, name, color
// [name, color]
const entityColorMap: EntityColorPair[] = [
  ...deriveEntityColorMap(templates),
  ...deriveEntityColorMap(terrainTemplates),
  ['door', '#73513d'] as EntityColorPair,
].sort((a, b) => {
  const nameA = a[0]
  const nameB = b[1]
  return nameB.length - nameA.length
})
console.log('LIST:', entityColorMap)

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
