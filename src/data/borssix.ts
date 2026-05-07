/**
 * BORSSIX.M2K — skill-bucket weight table for player generation.
 * borssix[nationIdx0][bucketIdx0] where both indices are 0-based.
 * (QB source: borssix(bucket 1..9, nation 1..17), column-major order in file.)
 *
 * Each nation's 9 bucket counts sum to 200. Bucket index maps to psk via:
 *   psk = (bucket + 1) * 2 + random.integer(0, 2) - 1   (bucket is 0-based here)
 * Or equivalently using 1-based bucket b:
 *   psk = b * 2 + INT(3 * RND) - 1   (QB borsgene ILEX5.BAS:1074)
 *
 * Nation order matches KANSAT.M2K (same as legacyNationalityToIso):
 *   0=FI  1=SE  2=DE  3=IT  4=RU  5=CZ  6=EE  7=LV
 *   8=CA  9=US  10=CH 11=SK 12=JP 13=NO 14=FR 15=AT 16=PL
 */
export const borssix: readonly (readonly number[])[] = [
  [10, 26, 40, 43, 45, 20, 10, 5, 1], // 0  FI
  [10, 26, 40, 43, 45, 20, 10, 5, 1], // 1  SE
  [20, 32, 40, 50, 40, 10, 5, 2, 1], // 2  DE
  [20, 32, 40, 50, 40, 10, 5, 2, 1], // 3  IT
  [10, 26, 40, 43, 45, 20, 10, 5, 1], // 4  RU
  [10, 26, 40, 43, 45, 20, 10, 5, 1], // 5  CZ
  [20, 32, 40, 50, 40, 10, 5, 2, 1], // 6  EE
  [20, 33, 46, 50, 25, 13, 8, 4, 1], // 7  LV
  [10, 30, 30, 35, 45, 20, 15, 10, 5], // 8  CA
  [10, 30, 30, 35, 45, 20, 15, 10, 5], // 9  US
  [20, 33, 40, 46, 32, 16, 8, 4, 1], // 10 CH
  [20, 33, 40, 46, 32, 16, 8, 4, 1], // 11 SK
  [20, 32, 40, 50, 40, 10, 5, 2, 1], // 12 JP
  [20, 32, 40, 50, 40, 10, 5, 2, 1], // 13 NO
  [20, 32, 40, 50, 40, 10, 5, 2, 1], // 14 FR
  [20, 32, 40, 50, 40, 10, 5, 2, 1], // 15 AT
  [20, 32, 40, 50, 40, 10, 5, 2, 1] // 16 PL
] as const;
