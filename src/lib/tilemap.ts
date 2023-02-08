const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const punctuation = '!@#$%^&*()-=+.,:;"<>?\\/|-:'
const numbers = '1234567890'

// get a range of tiles in the ROT format
const mapRange = (
  chars: string,
  y: number,
  tileSize: number
): { [key: string]: [number, number] } => {
  return chars.split('').reduce((acc, curr, i) => {
    return (acc = { ...acc, [curr]: [tileSize * i, tileSize * y] })
  }, {})
}

const mapChar = (x: number, y: number, tileSize: number): [number, number] => {
  return [x * tileSize, y * tileSize]
}

const t = 32 // main tileset size
const s = 32 // msg tileset size

export const tileMapOryxMessages = {
  ...mapRange(letters, 6, s),
  ...mapRange(letters.toLowerCase(), 6, s),
  ...mapRange(numbers, 7, s),
  ...mapRange(punctuation, 5, s),
  "'": mapChar(27, 3, s),
  ' ': mapChar(27, 0, s),
}

export const tileMapOryxMain = {
  ...mapRange(letters, 6, t),
  ...mapRange(letters.toLocaleLowerCase(), 6, t),
  ...mapRange(numbers, 7, t),
  ...mapRange(punctuation, 5, t),
  "'": mapChar(27, 3, t),
  ' ': mapChar(27, 0, t),
  bat: mapChar(21, 3, t),
  bigCheck: mapChar(21, 7, t),
  bigMozzie1: mapChar(23, 3, t),
  bigMozzie2: mapChar(24, 3, t),
  blob: mapChar(16, 3, t),
  bones: mapChar(5, 3, t),
  brick: mapChar(26, 8, t),
  bugman: mapChar(12, 3, t),
  cactus: mapChar(13, 0, t),
  caveWall: mapChar(25, 8, t),
  chicken: mapChar(18, 3, t),
  column: mapChar(19, 4, t),
  crab: mapChar(10, 3, t),
  crackedPath1: mapChar(9, 2, t),
  crackedPath2: mapChar(10, 2, t),
  crackedPath3: mapChar(11, 2, t),
  crackedPath4: mapChar(12, 2, t),
  crackedWall: mapChar(1, 2, t),
  deadGrass: mapChar(1, 0, t),
  demon: mapChar(4, 3, t),
  doorClosed: mapChar(13, 2, t),
  doorOpen: mapChar(14, 2, t),
  flames1: mapChar(4, 1, t),
  flames2: mapChar(5, 1, t),
  frog: mapChar(19, 3, t),
  ghost: mapChar(22, 3, t),
  grass: mapChar(0, 0, t),
  hammerheadman: mapChar(11, 3, t),
  heavyDoorClosed: mapChar(15, 2, t),
  heavyDoorOpen: mapChar(16, 2, t),
  hollowBox: mapChar(24, 7, t),
  mound: mapChar(7, 0, t),
  mozzie1: mapChar(2, 8, t),
  mozzie2: mapChar(3, 8, t),
  nest: mapChar(9, 0, t),
  path: mapChar(8, 2, t),
  peak: mapChar(4, 0, t),
  pip: mapChar(22, 7, t),
  sand: mapChar(27, 9, t),
  scorpion1: mapChar(0, 8, t),
  scorpion2: mapChar(1, 8, t),
  shrub: mapChar(2, 0, t),
  smallCheck: mapChar(20, 7, t),
  snake: mapChar(8, 3, t),
  solid: mapChar(27, 8, t),
  spider: mapChar(6, 3, t),
  stairsDown: mapChar(18, 2, t),
  stairsUp: mapChar(17, 2, t),
  stalk: mapChar(12, 0, t),
  statue: mapChar(19, 2, t),
  tick1: mapChar(25, 3, t),
  tick2: mapChar(26, 3, t),
  tombstone: mapChar(22, 2, t),
  tree: mapChar(5, 0, t),
  void: mapChar(13, 0, t),
  wall: mapChar(0, 2, t),
  water1: mapChar(0, 1, t),
  water2: mapChar(1, 1, t),
  web: mapChar(24, 8, t),
} satisfies { [key: string]: [number, number] }

const t2 = 24
export const tileMapT2 = {
  caveSolid1: mapChar(30, 22, t2),
  caveSolid2: mapChar(30, 22, t2),
  caveWall1: mapChar(12, 14, t2),
  caveFloor1: mapChar(4, 14, t2),
  '@': mapChar(37, 8, t2),
  solid: mapChar(4, 1, t2),
}

const t3 = 32
export const tileMapTiny = {
  caveSolid1: mapChar(6, 1, t3),
  caveSolid2: mapChar(7, 1, t3),
  caveSolid3: mapChar(8, 1, t3),
  caveSolid4: mapChar(9, 1, t3),
  caveSolid5: mapChar(10, 1, t3),
  caveSolid6: mapChar(11, 1, t3),
  caveWall1: mapChar(0, 1, t3),
  caveWall2: mapChar(1, 1, t3),
  caveWall3: mapChar(2, 1, t3),
  caveWall4: mapChar(3, 1, t3),
  caveWall5: mapChar(4, 1, t3),
  caveWall6: mapChar(5, 1, t3),
  caveFloor1: mapChar(0, 5, t3),
  caveFloor2: mapChar(1, 5, t3),
  caveFloor3: mapChar(2, 5, t3),
  caveFloor4: mapChar(3, 5, t3),
  caveFloor5: mapChar(4, 5, t3),
  caveFloor6: mapChar(5, 5, t3),
  '@': mapChar(13, 17, t3),
  solid: mapChar(0, 6, t3),
  water1: mapChar(4, 8, t3),
  water2: mapChar(5, 8, t3),
  web: mapChar(4, 13, t3),
}
