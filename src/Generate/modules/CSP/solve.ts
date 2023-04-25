import { EntityKey, Region } from '../../../Core'
import { point, Point } from '../../../lib/Shape/Point'
import { Rect } from '../../../lib/Shape/Rectangle'
import { pick, shuffle } from '../../../lib/util'
import { Overseer3 } from '../../Overseer3'
import { ConstraintKey, Constraints } from './Constraints'
import { VariableKey, Variables } from './Variables'

export type Assignment = {
  key: VariableKey
  region: Region
  domain: Set<Point>
  rect?: Rect
  constraints: Record<'required' | 'cells' | 'space', ConstraintKey[]>
  object: AssignmentObject
  optional: boolean
  timeout: number
  O3: Overseer3
  fastSnap?: boolean
}

type AssignmentObject = {
  keys: EntityKey[][]
  map: Map<Point, number[]>
  width: number
  height: number
}

type SolveConfig = {
  region: Region
  domain: Point[] | Rect
  variables: VariableKey[]
  optional?: boolean
  addConstraints?: ConstraintKey[]
  fastSnap?: boolean
}

const maxTimeMs = 1000

export function solve(config: SolveConfig, O3: Overseer3) {
  const assignments = createAssignments(config, O3)
  const origins = createOrigins(assignments)

  if (!solveNext(assignments, origins)) {
    const timeout = Date.now() > assignments[0].timeout
    console.error(`CSP Failed ${timeout ? 'Timeout' : ''} - ${config.variables.join(', ')}`)
  }
}

export function fill(config: SolveConfig, O3: Overseer3, percent: number) {
  if (percent < 0 || percent > 1) throw new Error('percent must be between 0 to 1')
  config.optional = true
  config.fastSnap = true

  const assignments = createAssignments(config, O3)
  const origins = createOrigins(assignments)

  for (const assignment of assignments) {
    const possible = origins[assignment.key].length
    const target = possible * percent
    let count = 0

    while (count < target && count < possible && Date.now() < assignment.timeout) {
      if (solveNext([assignment], origins)) count++
    }
  }
}

function solveNext(assignments: Assignment[], origins: Record<VariableKey, Point[]>, n = 0) {
  if (n >= assignments.length) return true

  const assignment = assignments[n]
  const { O3 } = assignment

  for (const originPt of shuffle(origins[assignment.key])) {
    if (Date.now() > assignment.timeout) {
      console.error('timeout')
      return false
    }

    const object = localizeObject(originPt, assignment.object)

    if (!satisfies(assignment, object)) {
      // failure
      O3.addObjectGhost(object, 'fogRed')
      O3.snap(`Invalid: ${assignment.key} ${n}`, 'fast')
      continue
    }

    // success
    const revert = O3.addObjectRevertible(object)
    O3.addObjectGhost(object, 'fogGreen')
    O3.snap(`Success: ${assignment.key} ${n}`, assignment.fastSnap ? 'fast' : '')

    // next
    if (solveNext(assignments, origins, n + 1)) return true
    else {
      // next problem failed, revert and try more points
      O3.revertObject(revert)
      O3.snap(`Revert: ${assignment.key} ${n}`)
    }
  }

  return assignment.optional
}

function satisfies(assignment: Assignment, map: Map<Point, EntityKey[]>) {
  for (const [pt, keys] of map) {
    const constraints =
      keys.length > 0 ? assignment.constraints.cells : assignment.constraints.space
    for (const key of constraints) {
      if (!Constraints[key](assignment, pt)) {
        return false
      }
    }
  }
  return true
}

function createAssignments(config: SolveConfig, O3: Overseer3) {
  const { region, domain, variables, optional, addConstraints, fastSnap } = config
  const domainSet = Array.isArray(domain) ? new Set(domain) : new Set([...domain.each()])
  const timeout = Date.now() + maxTimeMs

  const assignments = variables.map(key => {
    const variable = Variables[key]

    const { domain: required, cells } = variable.constraints
    const constraints = {
      required: [...required, ...(addConstraints ?? [])],
      cells,
      space: ['floor', 'walkable'] as ConstraintKey[],
    }

    const object = createObject(key)

    const assignment: Assignment = {
      key,
      optional: optional ?? true,
      region,
      domain: domainSet,
      constraints,
      object,
      timeout,
      O3,
      fastSnap: fastSnap ?? false,
    }

    if (domain instanceof Rect) assignment.rect = domain

    return assignment
  })

  return assignments
}

function createObject(key: VariableKey) {
  const { keys, map } = Variables[key]
  const zeroMap = new Map<Point, number[]>()
  let xMax = 0
  let yMax = 0

  map.forEach((row, y) => {
    row.forEach(layer => {
      layer.split('').forEach((cell, x) => {
        const zeroPt = point(x, y)
        const objectCell = zeroMap.get(zeroPt) ?? []

        if (cell !== ' ') {
          const n = parseInt(cell)
          if (isNaN(n)) throw new Error(`CSP keyRef is NaN: ${cell}`)
          objectCell.push(n)
        }

        zeroMap.set(zeroPt, objectCell)
        if (x > xMax) xMax = x
      })
    })
    if (y > yMax) yMax = y
  })
  const width = xMax + 1
  const height = yMax + 1

  const arrayedKeys = keys.map(k => (Array.isArray(k) ? k : [k]))

  return { keys: arrayedKeys, map: zeroMap, width, height }
}

function localizeObject(pt: Point, object: AssignmentObject) {
  const localMap = new Map<Point, EntityKey[]>()
  for (const [zeroPt, keys] of object.map) {
    const entityKeys = keys.map(k => pick(object.keys[k]))
    localMap.set(zeroPt.add(pt), entityKeys)
  }
  return localMap
}

function createOrigins(assignments: Assignment[]) {
  const origins = {} as Record<VariableKey, Point[]>

  for (const assignment of assignments) {
    const { key, domain, constraints, object } = assignment
    if (origins[key]) continue

    const originSet = new Set([...domain])

    for (const pt of domain) {
      // last point
      const pt2 = pt.add(object.width - 1, object.height - 1)

      // fast invalid if lastPt is out of domain bounds
      if (!domain.has(pt2)) {
        originSet.delete(pt)
        continue
      }

      // check constraints for origin/last point
      for (const cKey of constraints.required) {
        if (!Constraints[cKey](assignment, pt)) {
          originSet.delete(pt)
          break
        }
      }
    }

    origins[key] = [...originSet]
  }

  return origins
}
