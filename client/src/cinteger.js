import { List, Repeat, Range } from "immutable";
import r, { cinteger } from "./services/random";

const max = 1;
const range = 10000;

let list = Repeat(0, max + 1).toList();
let clist = Repeat(0, max + 1).toList();

Range(0, range)
  .toList()
  .forEach(rng => {
    const integer = r.integer(0, max);
    list = list.update(integer, l => l + 1);

    const cint = cinteger(0, max);
    clist = clist.update(cint, l => l + 1);
  });

console.log(list.toJS());

console.log(clist.toJS());
