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
  ' ': mapChar(13, 0, s),
}

export const tileMapOryxMain = {
  ...mapRange(letters, 6, t),
  ...mapRange(letters.toLocaleLowerCase(), 6, t),
  ...mapRange(numbers, 7, t),
  ...mapRange(punctuation, 5, t),
  "'": mapChar(27, 3, t),
  ' ': mapChar(13, 0, t),
  bat: mapChar(21, 3, t),
  blob: mapChar(16, 3, t),
  bones: mapChar(5, 3, t),
  bigCheck: mapChar(21, 7, t),
  smallCheck: mapChar(20, 7, t),
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
  heavyDoorClosed: mapChar(15, 2, t),
  heavyDoorOpen: mapChar(16, 2, t),
  hollowBox: mapChar(24, 7, t),
  mound: mapChar(7, 0, t),
  hammerheadman: mapChar(11, 3, t),
  bugman: mapChar(12, 3, t),
  path: mapChar(8, 2, t),
  peak: mapChar(4, 0, t),
  pip: mapChar(22, 7, t),
  shrub: mapChar(2, 0, t),
  snake: mapChar(8, 3, t),
  spider: mapChar(6, 3, t),
  stairsUp: mapChar(17, 2, t),
  stairsDown: mapChar(18, 2, t),
  statue: mapChar(19, 2, t),
  tombstone: mapChar(22, 2, t),
  tree: mapChar(5, 0, t),
  void: mapChar(13, 0, t),
  wall: mapChar(0, 2, t),
  water: mapChar(0, 1, t),
} satisfies { [key: string]: [number, number] }
