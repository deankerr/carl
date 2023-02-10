export const caveWallBase = {
  name: 'wall',
  tiles: ['caveWall1'],
  tag: ['terrain', 'blocksLight', 'blocksMovement', 'wall'],
  wallVariant: ['caveWall1', 'caveWall2'],
  faceVariant: ['caveFace1', 'caveFace2', 'caveFace3', 'caveFace4', 'caveFace5', 'caveFace6'],
}

export const caveFaceBase = {
  name: 'wall',
  tiles: ['caveWallFace1'],
  tag: ['terrain', 'blocksLight', 'blocksMovement', 'wall', 'isFace'],
  wallVariant: ['caveWall1', 'caveWall2'],
  faceVariant: ['caveFace1', 'caveFace2', 'caveFace3', 'caveFace4', 'caveFace5', 'caveFace6'],
}

export function caveWall(n: number) {
  return {
    ...caveWallBase,
    name: 'caveWall' + n,
    tiles: ['caveWall' + n],
  } as const
}

export function caveFace(n: number) {
  return {
    ...caveFaceBase,
    name: 'caveFace' + n,
    tiles: ['caveFace' + n],
  } as const
}
