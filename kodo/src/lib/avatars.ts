// Avatars prédéfinis : de petites images en cellules (8 × 8), sur des motifs japonais.
// Aucun téléversement : la base ne stocke que l'identifiant (profiles.avatar).
export interface AvatarDef {
  id: string
  kanji: string
  fr: string
  en: string
  bg: string
  /** Couleurs des chiffres 1, 2, 3 de la grille */
  colors: string[]
  /** 8 lignes de 8 caractères : '.' = fond, '1'..'3' = couleur */
  px: string[]
}

export const AVATARS: AvatarDef[] = [
  { id: 'neko', kanji: '猫', fr: 'Chat', en: 'Cat', bg: '#ece7f6', colors: ["#3b3550", "#f2b8c6", "#f7f3e8"], px: ["........", ".1....1.", ".11..11.", ".111111.", ".131131.", ".111111.", "..1221..", "........"] },
  { id: 'kitsune', kanji: '狐', fr: 'Renard', en: 'Fox', bg: '#fbe9da', colors: ["#e0773a", "#fff6ec", "#3a2a22"], px: ["1......1", "11....11", "11111111", "13111131", "12111121", ".122221.", "..2332..", "...22..."] },
  { id: 'usagi', kanji: '兎', fr: 'Lapin', en: 'Rabbit', bg: '#e4eefb', colors: ["#f7f7fa", "#f2a5b8", "#2b2b3a"], px: [".1...1..", ".12..12.", ".12..12.", ".111111.", "11311311", "11122111", ".111111.", "..1..1.."] },
  { id: 'kuma', kanji: '熊', fr: 'Ours', en: 'Bear', bg: '#ece4da', colors: ["#5b4636", "#d9c2a5", "#1f1915"], px: ["11....11", "12111121", "11111111", "13111131", "11122111", ".112311.", "..1221..", "........"] },
  { id: 'shiba', kanji: '柴', fr: 'Shiba', en: 'Shiba', bg: '#f7ead9', colors: ["#d98a3d", "#fbf2e6", "#2e2420"], px: ["1......1", "11....11", "11111111", "13122131", "12222221", ".122321.", "..2222..", "........"] },
  { id: 'kaeru', kanji: '蛙', fr: 'Grenouille', en: 'Frog', bg: '#e5f3df', colors: ["#5fae4e", "#ffffff", "#22301f"], px: [".11..11.", "12311231", "11111111", "11111111", "13333331", ".111111.", "..1..1..", "........"] },
  { id: 'fuji', kanji: '富士', fr: 'Mont Fuji', en: 'Mount Fuji', bg: '#dfe9f7', colors: ["#4b5f8c", "#ffffff", "#e8a33d"], px: ["......33", "......33", "...22...", "..2222..", ".112211.", ".111111.", "11111111", "11111111"] },
  { id: 'tsuki', kanji: '月', fr: 'Lune', en: 'Moon', bg: '#232a45', colors: ["#f5e6a8", "#d8c57d", "#ffffff"], px: ["......3.", "..111...", ".1112...", "11122...", "1112....", "11112..3", ".11112..", "..111..."] },
  { id: 'hoshi', kanji: '星', fr: 'Étoile', en: 'Star', bg: '#232a45', colors: ["#f5d76e", "#ffffff", "#8c96d8"], px: ["...1....", "...1..3.", "1111111.", ".11111..", "..111.2.", ".11.11..", "1.....1.", "...3...."] },
  { id: 'sakura', kanji: '桜', fr: 'Cerisier', en: 'Cherry blossom', bg: '#fbe8ee', colors: ["#f29bb5", "#d4567d", "#fff2f6"], px: ["...11...", "..1111..", "11.11.11", "11122111", ".112211.", "..1..1..", ".11..11.", "........"] },
  { id: 'take', kanji: '竹', fr: 'Bambou', en: 'Bamboo', bg: '#e6f2e2', colors: ["#3f8a4c", "#2c6a37", "#a8d49a"], px: [".1...1..", ".2..31..", ".1.33.1.", ".1...2..", ".2...1.3", ".1..31..", ".1...1..", ".2...2.."] },
  { id: 'torii', kanji: '鳥居', fr: 'Torii', en: 'Torii gate', bg: '#f7e9e3', colors: ["#d33c2f", "#2b2b2b", "#f2d8cf"], px: ["22222222", "11111111", ".1....1.", "11111111", ".1....1.", ".1....1.", ".1....1.", ".2....2."] },
  { id: 'daruma', kanji: '達磨', fr: 'Daruma', en: 'Daruma', bg: '#f6e6e3', colors: ["#c9302c", "#fbf3ea", "#2b2b2b"], px: ["..1111..", ".111111.", "1122221.", "1232232.", "1122221.", "1111111.", ".111111.", "..1111.."] },
  { id: 'onigiri', kanji: 'お握り', fr: 'Onigiri', en: 'Onigiri', bg: '#eef2ea', colors: ["#ffffff", "#24312b", "#e7e3da"], px: ["...11...", "..1111..", ".111111.", ".111111.", "11111111", "11222211", "11222211", "........"] },
  { id: 'chochin', kanji: '提灯', fr: 'Lanterne', en: 'Lantern', bg: '#2a2440', colors: ["#f0a13c", "#d3364a", "#3a3046"], px: ["...33...", "..1111..", ".122221.", ".111111.", ".122221.", ".111111.", "..1111..", "...33..."] },
  { id: 'robo', kanji: 'ロボ', fr: 'Robot', en: 'Robot', bg: '#e4e6fb', colors: ["#5a64e6", "#ffffff", "#2a2f6a"], px: ["...3....", "...1....", ".111111.", ".122221.", ".131131.", ".111111.", "..1331..", ".11..11."] },
]

const byId = new Map(AVATARS.map((a) => [a.id, a]))

/** Avatar choisi, ou à défaut un avatar stable dérivé de l'identifiant du compte. */
export function avatarFor(chosen: string | null | undefined, seed: string): AvatarDef {
  const picked = chosen ? byId.get(chosen) : undefined
  if (picked) return picked
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return AVATARS[(h >>> 0) % AVATARS.length]
}
