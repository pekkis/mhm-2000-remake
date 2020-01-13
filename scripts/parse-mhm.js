import { last, range, head, take, indexBy } from "ramda";
import path from "path";
import raf from "random-access-file";
import fs from "fs";
import iconv from "iconv-lite";
import glob from "glob";
import { parseSync } from "@babel/core";

const BLOCK_SIZE = 500;

const getAllMHMFiles = async () => {
  const p = new Promise(resolve => {
    glob(path.resolve(__dirname, "../legacy/DATA/*.MHM"), (e, matches) =>
      resolve(matches)
    );
  });
  return await p;
};

const parseBlock = async (file, block) => {
  return new Promise((resolve, reject) => {
    return file.read(block - 1 * BLOCK_SIZE, BLOCK_SIZE, function(err, buffer) {
      var buff = Buffer.from(buffer);
      var xoo = iconv.decode(buff, "cp437");
      const massaged = xoo.trim();
      resolve(massaged);
    });
  });
};

const parseMHMFile = async MHMFile => {
  const data = fs.statSync(MHMFile);
  const blocks = data.size / BLOCK_SIZE;

  const file = raf(MHMFile);
  let ret = [];

  for (let x = 1; x <= blocks; x = x + 1) {
    const pa = await parseBlock(file, x);
    ret = [...ret, pa];
  }
  return ret;
};

const run = async () => {
  // const identifier = last(process.argv).toUpperCase();
  // const MHMFile = path.resolve(__dirname, `../legacy/DATA/${identifier}.MHM`);

  const files = await getAllMHMFiles();

  let parsed = [];
  for (const file of files) {
    const pa = await parseMHMFile(file);

    console.log(pa);

    console.log("hellurei");
    parsed = [...parsed, pa];
  }

  files.forEach((file, i) => {
    const p = JSON.stringify(parsed[i], undefined, 2);

    const split = file.split("/");

    fs.writeFileSync(
      path.resolve(__dirname, "./output/mhm/" + split.pop() + ".json"),
      p
    );
  });

  console.log(parsed);
};

run();
