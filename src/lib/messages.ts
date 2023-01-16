import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { templates } from '../Core/Entity'
import { terrainTemplates } from '../Core/Terrain'

const hex = (c: string) => ROT.Color.toHex(ROT.Color.fromString(c))

const createRegex = (val: string) => {
  return new RegExp(`\\b${val}\\b`)
}

// [regex, entityName, color]
const entityColors = [
  ...Object.entries(templates).map(e => [createRegex(e[1][0]), e[1][0], hex(e[1][2])]),
  ...Object.entries(terrainTemplates).map(e => [createRegex(e[1][0]), e[1][0], hex(e[1][2])]),
  [createRegex('door'), 'door', '#73513d'],
]

export type Message = {
  turn: number
  content: string
  colors: string[]
}

// add the entity's color before its name
export function colorMessage(msg: string) {
  console.log('LIST:', entityColors)
  let result = msg
  // let result2 = [msg]

  for (const entity of entityColors) {
    result = result.replace(entity[0], `%c{${entity[2]}}${entity[1]}%c{${CONFIG.messageColor}}`)
  }

  // const msgNEW

  console.log('result:', result)
  return result
}
