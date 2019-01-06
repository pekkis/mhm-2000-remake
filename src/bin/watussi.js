import { List } from "immutable";

const ret0 = "loso";
const ret1 = List.of("loso", "naama");

const list1 = List(List.isList(ret0) ? ret0 : List.of(ret0));

const list2 = List(List.isList(ret1) ? ret1 : List.of(ret1));

console.log(list1);
console.log(list2);
