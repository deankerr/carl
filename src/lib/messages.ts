import * as ROT from 'rot-js'
import { templates } from '../Core/Entity'
import { terrainTemplates } from '../Core/Terrain'

const hex = (c: string) => ROT.Color.toHex(ROT.Color.fromString(c))

const createRegex = (val: string) => {
  return new RegExp(`\\b${val}\\b`, 'gi')
}

type EntityColor = [RegExp, string, string]

function deriveEntityColorMap<T extends typeof templates | typeof terrainTemplates>(list: T): EntityColor[] {
  const entries = Object.entries(list)
  return entries.map(e => [createRegex(e[1][0]), hex(e[1][2]), e[1][0]] as [RegExp, string, string])
}

// sorted mapping of entity name Regex, name, color
// [regex, color, name]
const entityColorMap: [RegExp, string, string][] = [
  ...deriveEntityColorMap(templates),
  ...deriveEntityColorMap(terrainTemplates),
  [createRegex('door'), 'door', '#73513d'] as EntityColor,
].sort((a, b) => {
  const nameA = a[2]
  const nameB = b[2]
  return nameB.length - nameA.length
})
console.log('LIST:', entityColorMap)

export type Message = {
  turn: number
  raw: string
  colors: EntityColor[]
}

// add the entity's color before its name
// export function colorizeMessage(msg: string) {
//   let result2 = msg

//   const foundColors: [number, string][] = []
//   for (const entity of entityColorMap) {
//     const matches = msg.matchAll(entity[0] as RegExp)

//     for (const match of matches) {
//       // console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`)
//       // result2 = result2.slice(0, match.index) + '%K' + result2.slicresult2.slice(match.index + match[0].length)
//       console.log('match:', match, 'entity', entity[1], ' color', entity[2])
//       result2 = result2.replace(entity[0], `%E${match[0]}%O`)
//       foundColors.push([match.index ?? 0, entity[2] as string])
//     }
//   }

//   console.log('colors!!!:', foundColors)
//   const colors = foundColors.sort((a, b) => a[0] - b[0]).map(c => c[1])
//   console.log('colors:', colors)

//   const msgObj: [string, string[]] = [result2, colors]
//   console.log('msgObj:', msgObj)

//   return msgObj
// }

export function colorizeMessage(msg: string) {
  let searchString = msg
  const matchedTextColor: EntityColor[] = []

  for (const entity of entityColorMap) {
    const matches = msg.matchAll(entity[0])
    for (const match of matches) {
      console.log('match:', match, 'reg:', entity[0], 'entity:', entity[1], 'color:', entity[2])
      matchedTextColor.push(entity)
      // replace match substring with spaces
      searchString.replaceAll(entity[0], ' '.repeat(entity[2].length))
    }
  }

  console.log('msg:', msg)
  console.log('searchString:', searchString)
  console.log('matchedTextColor:', matchedTextColor)
  return matchedTextColor
}
