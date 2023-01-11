import { templates } from "../Core/Entity"

export const populateNPCs = (level: Level) => {
  templates.player(level.ptInRoom(0), 5)

  const npcs = ROT.RNG.shuffle([
    'orc',
    'spider',
    'snake',
    'toad',
    'crab',
    'ghost',
    'demon',
    'hammerhead',
    'skeleton',
    'chicken',
    'bat',
    'karl',
  ])

  level.rooms.forEach((_r, i) => {
    if (i === 0 || i >= npcs.length) return
    const pos = level.ptInRoom(i)
    const choice = npcs[i]
    if (templates[choice]) this.create(templates[choice](pos))
  })
}


__features(level: Level) {
  level.rooms.forEach((r, i) => {
    // shrubbery
    if (i % 3 === 0) {
      for (let j = 0; j < 6; j++) this.create(templates.shrub(level.ptInRoom(i)))
    }

    // water
    if (i % 4 === 1) {
      // r.rect.traverse((x, y) => {
      //   level.terrain.set(Pt(x, y), 3)
      // })
      r.forEach(pt => level.terrainGrid.set(pt, 3))
    }
  })

  // cracked walls/paths
  level.terrainGrid.each((pt, t) => {
    if (t === 0 && rnd(0, 3) === 0) level.terrainGrid.set(pt, rnd(4, 7))
    if (t === 1 && rnd(0, 16) === 0) level.terrainGrid.set(pt, 2)
  })
}