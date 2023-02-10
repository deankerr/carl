// import { EntityTemplate } from '../Core'

// const seriesTemplate = {
//   solid: {
//     label: 'Solid',
//     name: ['wall'],
//     tiles: ['Solid'],
//     tag: ['terrain', 'blocksMovement', 'blocksLight'],
//   },
//   face: {
//     label: 'Wall',
//     name: ['wall'],
//     tiles: ['Wall'],
//     tag: ['terrain', 'blocksMovement', 'blocksLight', 'face'],
//   },
//   floor: {
//     label: 'Floor',
//     name: ['floor'],
//     tiles: ['Floor'],
//     tag: ['terrain'],
//   },
// }

// export function series(type: keyof typeof seriesTemplate, name: string, n: number) {
//   let i = 0
//   const result: EntityTemplate[] = []
//   while (i <= n) {
//     const base = { ...seriesTemplate[type] } as EntityTemplate
//     const key = i ? `${name}${base.label}${i}` : `${name}${base.label}`
//     base.label = key
//     base.tiles = i ? [key] : [key + '1']
//     result.push(base)
//     i++
//   }
//   return result
// }
