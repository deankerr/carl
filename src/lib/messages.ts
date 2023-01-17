import * as ROT from 'rot-js'
import { templates } from '../Core/Entity'
import { terrainTemplates } from '../Core/Terrain'

const hex = (c: string) => ROT.Color.toHex(ROT.Color.fromString(c))

const createRegex = (val: string) => {
  return new RegExp(`\\b${val}\\b`, 'gi')
}

// [regex, entityName, color]
const entityColor = [
  ...Object.entries(templates).map(e => [createRegex(e[1][0]), e[1][0], hex(e[1][2])]),
  ...Object.entries(terrainTemplates).map(e => [createRegex(e[1][0]), e[1][0], hex(e[1][2])]),
  [createRegex('door'), 'door', '#73513d'],
].sort((a, b) => {
  const nameA = a[1] as string
  const nameB = b[1] as string
  return nameB.length - nameA.length
})
console.log('LIST:', entityColor)

export type Message = {
  turn: number
  raw: string
  display: string
  colors: string[]
}

// add the entity's color before its name
export function colorizeMessage(msg: string) {
  let result2 = msg

  const foundColors: [number, string][] = []
  for (const entity of entityColor) {
    const matches = msg.matchAll(entity[0] as RegExp)

    for (const match of matches) {
      // console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`)
      // result2 = result2.slice(0, match.index) + '%K' + result2.slicresult2.slice(match.index + match[0].length)
      console.log('match:', match, 'entity', entity[1], ' color', entity[2])
      result2 = result2.replace(entity[0], `%E${match[0]}%O`)
      foundColors.push([match.index ?? 0, entity[2] as string])
    }
  }

  console.log('colors!!!:', foundColors)
  const colors = foundColors.sort((a, b) => a[0] - b[0]).map(c => c[1])
  console.log('colors:', colors)

  const msgObj: [string, string[]] = [result2, colors]
  console.log('msgObj:', msgObj)

  return msgObj
}

export function colorizeMessage2(msg: string) {
  let searchString = msg
  const matchedTextColor: [RegExp, string][] = []

  for (const entity of entityColor) {
    const matches = msg.matchAll(entity[0] as RegExp)
    for (const match of matches) {
      console.log('match:', match, 'entity:', entity[1], 'color:', entity[2])
      matchedTextColor.push([entity[0] as RegExp, entity[2] as string]) // TODO
      // replace
    }
  }
}
