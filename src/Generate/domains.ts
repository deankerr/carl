/* eslint-disable @typescript-eslint/no-explicit-any */
// read the domain template file, create domain nodes and link them
import * as Templates from '../Templates'
import * as Generate from '../Generate'
import { Level } from '../Model/Level'

export function createDomains(): [DomainMap, Domain] {
  // process templates into nodes without connections
  const nodeMap = Templates.domains.reduce((acc, d) => {
    const node: Domain = {
      label: d.label,
      revealed: d.revealed,
      playerFOV: d.playerFOV,
      generator: generators[d.generator],
      levels: [],
      connections: {
        top: undefined,
        ascend: undefined,
        descend: undefined,
        bottom: undefined,
      },
    }
    return { ...acc, [d.label]: node }
  }, {} as DomainMap)

  // iterate through the templates again, connecting the node references
  Templates.domains.forEach(t => {
    const node = nodeMap[t.label]
    const { top, ascend, descend } = t.connections
    node.connections.top = top ? nodeMap[top] : undefined
    node.connections.ascend = ascend ? nodeMap[ascend] : undefined
    node.connections.descend = descend ? nodeMap[descend] : undefined
  })

  // return the domains and domain to start the game on
  const root = nodeMap[Templates.domains[0].label]
  return [nodeMap, root]
}

export type Domain = {
  label: string
  revealed: boolean
  playerFOV: number
  generator: (...args: any[]) => Generate.NewLevel // TODO gen params
  levels: Level[]
  connections: {
    top: Domain | undefined
    ascend: Domain | undefined
    descend: Domain | undefined
    bottom: Domain | undefined
  }
}

export type DomainMap = Record<string, Domain>

const generators: Record<string, Domain['generator']> = {
  outdoor: Generate.outdoor,
  dungeon4: Generate.dungeon4,
  ruin1: Generate.prefabRuin1,
  flameTest: Generate.flameTest,
}
