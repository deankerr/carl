const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const punctuation = '!@#$%^&*()-=+.,:;"<>?\\/|-:'
const numbers = '1234567890'

// get a range of tiles in the ROT format
const mapRange = (chars: string, y: number, tileSize: number): { [key: string]: [number, number] } => {
  return chars.split('').reduce((acc, curr, i) => {
    return (acc = { ...acc, [curr]: [tileSize * i, tileSize * y] })
  }, {})
}

const mapChar = (x: number, y: number, tileSize: number): [number, number] => {
  return [x * tileSize, y * tileSize]
}

const s = 16
export const tileMapOryxMessages = {
  ...mapRange(letters, 6, s),
  ...mapRange(letters.toLowerCase(), 6, s),
  ...mapRange(numbers, 7, s),
  ...mapRange(punctuation, 5, s),
  "'": mapChar(12, 0, s),
  ' ': mapChar(13, 0, s),
}

const t = 24
export const tileMapOryxMain = {
  ...mapRange(letters, 6, t),
  ...mapRange(letters.toLocaleLowerCase(), 6, t),
  ...mapRange(numbers, 7, t),
  ...mapRange(punctuation, 5, t),
  "'": mapChar(26, 8, t),
  ' ': mapChar(13, 0, t),
  'O#': mapChar(0, 2, t),
  'O[': mapChar(1, 2, t),
  'O.': mapChar(8, 2, t),
  'O.0': mapChar(9, 2, t),
  'O.1': mapChar(10, 2, t),
  'O.2': mapChar(11, 2, t),
  'O.3': mapChar(12, 2, t),
  Oo: mapChar(12, 3, t),
  Ox: mapChar(6, 3, t),
  Os: mapChar(8, 3, t),
  Ot: mapChar(19, 3, t),
  Or: mapChar(10, 3, t),
  Og: mapChar(22, 3, t),
  OD: mapChar(4, 3, t),
  OH: mapChar(11, 3, t),
  OS: mapChar(5, 3, t),
  Oc: mapChar(18, 3, t),
  Oa: mapChar(21, 3, t),
  'O+': mapChar(13, 2, t),
  'O/': mapChar(14, 2, t),
  Ov: mapChar(2, 0, t),
  '~': mapChar(0, 1, t),
  'O"': mapChar(0, 0, t),
  'O:': mapChar(1, 0, t),
  'O<': mapChar(17, 2, t),
  'O>': mapChar(18, 2, t),
  OT: mapChar(5, 0, t),
  OM: mapChar(7, 0, t),
  OP: mapChar(4, 0, t),
} satisfies { [key: string]: [number, number] }
