import glob from "glob";
import path from "path";
import fs from "fs";
import { trim, takeLast } from "ramda";
import { tail } from "ramda";
import util from "util";

const p = path.resolve(__dirname, "./output");

/*
PEKKALANDIA,PLN,1,14
RUOTSI,SWE,1,14
SAKSA,GER,2,9
ITALIA,ITA,1,10
VEN�J�,RUS,1,14
TSEKKI,TCH,1,14
EESTI,EST,2,8
LATVIA,LAT,1,11
KANADA,CAN,1,13
YHDYSVALLAT,USA,1,13
SVEITSI,SUI,1,11
SLOVAKIA,SVK,1,13
JAPANI,JPN,2,9
NORJA,NOR,2,10
RANSKA,FRA,2,10
IT�VALTA,AUT,2,10
PUOLA,POL,2,10
BRASILIA,BRA,3,39
ZIMBABWE,ZIM,3,39
ESPANJA,ESP,3,39
TUNTEMATON,???,3,39
POHJOIS-KOREA,PKR,3,39
*/

const countries = [
  "FI",
  "SE",
  "DE",
  "IT",
  "RU",
  "CZ",
  "EE",
  "LV",
  "CA",
  "US",
  "CH",
  "SK",
  "JP",
  "NO",
  "FR",
  "AT",
  "PL"
  // "BR",
  // "ZW",
  // "??",
  // "KP"
];

countries
  .map((c, i) => path.resolve(__dirname, `./output/${i + 1}.mhx`))
  .map(file => fs.readFileSync(file, { encoding: "utf-8" }))
  .map(file =>
    file
      .split("\r\n")
      .map(trim)
      .filter(n => n.length > 0)
      .map(n => n.substring(1, n.length - 1))
  )
  .map(names => JSON.stringify(names, undefined, 2))
  .forEach((json, i) => {
    fs.writeFileSync(
      path.resolve(__dirname, "./output/players-" + countries[i] + ".ts"),
      `import { NameList } from "../../types/country";

const names: NameList = ${json};

export default names;`,
      {
        encoding: "utf-8"
      }
    );
  });

// options is optional
/*
glob(p + "/*.mhx", function(er, files) {
  const jsons = files
    .map((countryFile, i) => {
      const file = fs.readFileSync(countryFile, { encoding: "utf-8" });

      const split = file
        .split("\r\n")
        .map(trim)
        .filter(n => n.length > 0)
        .map(n => n.substring(1, n.length - 1));

      return split;
    })
    .map(names => JSON.stringify(names, undefined, 2));

  jsons.forEach();
});
*/
