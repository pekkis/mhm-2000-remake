export const levelDescriptions = [
  "TÄYSI NOLLA",
  "SUORAAN ANUKSESTA",
  "KATASTROFAALINEN",
  "SURKEAAKIN SURKEAMPI",
  "KAUHEAN KEHNO",
  "LUOKATON",
  "ALA-ARVOINEN",
  "TÄYSIN OSAAMATON",
  "ONNETON",
  "HUONOHKO",
  "MITÄÄSANOMATON",
  "KESKINKERTAINEN",
  "MUKIINMENEVÄ",
  "HYVÄ KOKONAISUUS",
  "OSAAMISTAKIN LÖYTYY",
  "TAIDOKASTA PORUKKAA",
  "TERÄKSINEN",
  "MAAILMANLUOKKAAN KUULUVAA",
  "SUPERTÄHTIEN TYYSSIJA",
  "TAIVAALLISEN MESSIAANINEN"
];

export interface TeamLevelData {
  strength: { g: number; d: number; a: number };
  description: string;
}

export const levels: TeamLevelData[] = [
  { strength: [2, 6, 12], description: levelDescriptions[0] },
  { strength: [3, 8, 16], description: levelDescriptions[0] },
  { strength: [4, 10, 20], description: levelDescriptions[0] },
  { strength: [4, 12, 24], description: levelDescriptions[0] },
  { strength: [4, 14, 28], description: levelDescriptions[0] },
  { strength: [5, 16, 32], description: levelDescriptions[0] },
  { strength: [5, 18, 36], description: levelDescriptions[0] },
  { strength: [5, 20, 40], description: levelDescriptions[0] },

  { strength: [6, 22, 44], description: levelDescriptions[1] },
  { strength: [6, 24, 48], description: levelDescriptions[1] },
  { strength: [6, 26, 52], description: levelDescriptions[1] },

  { strength: [6, 28, 56], description: levelDescriptions[2] },
  { strength: [6, 30, 60], description: levelDescriptions[2] },
  { strength: [7, 32, 64], description: levelDescriptions[2] },

  { strength: [7, 34, 68], description: levelDescriptions[3] },
  { strength: [7, 36, 72], description: levelDescriptions[3] },
  { strength: [8, 38, 76], description: levelDescriptions[3] },

  { strength: [8, 40, 80], description: levelDescriptions[4] },
  { strength: [8, 42, 84], description: levelDescriptions[4] },
  { strength: [9, 44, 88], description: levelDescriptions[4] },

  { strength: [9, 46, 92], description: levelDescriptions[5] },
  { strength: [9, 48, 96], description: levelDescriptions[5] },

  { strength: [10, 50, 100], description: levelDescriptions[6] },
  { strength: [10, 52, 104], description: levelDescriptions[6] },

  { strength: [10, 54, 108], description: levelDescriptions[7] },
  { strength: [11, 56, 112], description: levelDescriptions[8] },
  { strength: [11, 58, 116], description: levelDescriptions[9] },
  { strength: [12, 60, 120], description: levelDescriptions[10] },
  { strength: [12, 62, 124], description: levelDescriptions[11] },
  { strength: [12, 64, 128], description: levelDescriptions[12] },
  { strength: [13, 66, 132], description: levelDescriptions[13] },
  { strength: [13, 68, 136], description: levelDescriptions[14] },
  { strength: [13, 70, 140], description: levelDescriptions[15] },

  { strength: [14, 72, 144], description: levelDescriptions[16] },
  { strength: [14, 74, 148], description: levelDescriptions[16] },

  { strength: [15, 76, 152], description: levelDescriptions[17] },
  { strength: [15, 78, 156], description: levelDescriptions[17] },

  { strength: [15, 80, 160], description: levelDescriptions[18] },
  { strength: [15, 82, 164], description: levelDescriptions[18] },
  { strength: [16, 84, 168], description: levelDescriptions[18] },

  { strength: [16, 86, 172], description: levelDescriptions[19] },
  { strength: [16, 88, 176], description: levelDescriptions[19] },
  { strength: [16, 90, 180], description: levelDescriptions[19] },
  { strength: [17, 92, 184], description: levelDescriptions[19] },
  { strength: [17, 94, 188], description: levelDescriptions[19] },
  { strength: [17, 96, 192], description: levelDescriptions[19] },
  { strength: [17, 98, 196], description: levelDescriptions[19] },
  { strength: [18, 100, 200], description: levelDescriptions[19] },
  { strength: [18, 102, 204], description: levelDescriptions[19] },
  { strength: [18, 104, 208], description: levelDescriptions[19] },
  { strength: [18, 106, 212], description: levelDescriptions[19] },
  { strength: [18, 108, 216], description: levelDescriptions[19] },
  { strength: [18, 110, 220], description: levelDescriptions[19] },
  { strength: [19, 112, 224], description: levelDescriptions[19] },
  { strength: [19, 114, 228], description: levelDescriptions[19] },
  { strength: [19, 116, 232], description: levelDescriptions[19] },
  { strength: [20, 118, 236], description: levelDescriptions[19] },
  { strength: [20, 120, 240], description: levelDescriptions[19] }
].map(level => {
  const [g, d, a] = level.strength;
  return {
    strength: { g, d, a },
    description: level.description
  };
});

export default levels;
