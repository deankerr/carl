import * as ROT from 'rot-js'
import { Grid } from '../Model/Grid'
import { Terrain } from '../Templates'
import { createTemplates, Entity } from '../Core/Entity'
import { Level } from '../Model/Level'
import { Point, Pt, StrPt } from '../Model/Point'
import { half, pick, repeat, rnd } from '../lib/util'

type Mutation = Map<string, Entity>

// stairs/connectors?
export function overworld(width = 60, height = 29) {
  ROT.RNG.setSeed(1234)
  console.log(width * height)

  const terrain = Grid.fill(width, height, Terrain.path)
  const mutations: Mutation[] = []

  // TODO common level points, make this resuable
  const center = Pt(half(width), half(height))

  mutations.push(walk(terrain, Terrain.grass, 1000, center))

  apply(terrain, mutations)

  const entities = createTemplates()
  const level = new Level('overworld', terrain)
  console.log('mutations:', mutations)
  return [level, entities]
}

function apply(grid: Grid<Entity>, mutations: Mutation[]) {
  for (const mut of mutations) {
    for (const [pt, t] of mut) {
      grid.set(StrPt(pt), t)
    }
  }
}

function walk(grid: Grid<Entity>, type: Entity, amount: number, start?: Point): Mutation {
  const mutations = new Map()
  let pt = start ?? grid.rndPt()
  mutations.set(pt.s, type)
  // north, east, south, west
  const moves = [Pt(0, -1), Pt(1, 0), Pt(0, 1), Pt(-1, 0)]
  repeat(amount, () => {
    const dir = pick(moves)
    pt = pt.add(dir)
    mutations.set(pt.s, type)
  })

  console.log('mutations:', mutations)
  return mutations
}
