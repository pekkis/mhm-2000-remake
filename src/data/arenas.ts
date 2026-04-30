const price = (level: number): number => 100000 + 200000 * level;

export type Arena = {
  id: number;
  name: string;
  price: number;
};

const arenas: Arena[] = [
  { id: 0, name: "Ulkohuussi", price: 0 },
  { id: 1, name: "Navetta", price: price(1) },
  { id: 2, name: "Lato", price: price(2) },
  { id: 3, name: "Pieni perushalli", price: price(3) },
  { id: 4, name: "Perushalli", price: price(4) },
  { id: 5, name: "Mainio jäähalli", price: price(5) },
  { id: 6, name: "Upea jäähalli aitioineen", price: price(6) },
  { id: 7, name: "NHL-kelpoinen superjäähalli", price: price(7) },
  { id: 8, name: "Typhoon-luokan viihdekeskus", price: price(8) },
  { id: 9, name: "Hjallis-luokan monitoimihalli", price: price(9) }
];

export default arenas;
