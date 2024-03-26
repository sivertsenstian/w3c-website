/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Generates locale files in `src/locales/[lang].ts`
 * Content is pulled from this Goolge Sheet:
 * https://docs.google.com/spreadsheets/d/1V5f4zguWDmk9nbnoXSJm9g-ZxImo83NJpSY17EUkzOc/edit#gid=0
 *
 * ⚠️ For this script to work you need to have a Google API key with Sheets enabled (https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication)
 * Place it in a .env file as GOOGLE_API_KEY
 */

const fs = require("fs");
const set = require("lodash.set");
const prettier = require("prettier");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const activeLanguages = require("./active-languages");
const keyConstant = require ("./key");

const doc = new GoogleSpreadsheet(
  "1V5f4zguWDmk9nbnoXSJm9g-ZxImo83NJpSY17EUkzOc"
);

doc.useApiKey(keyConstant);

const languages = activeLanguages || ["en", "de"];
const locales = {};

async function main() {
  await doc.loadInfo();
  const firstSheet = doc.sheetsByIndex[0];
  const rows = await firstSheet.getRows({ offset: 1 });

  for (const row of rows) {
    for (const lang of languages) {
      // we dont want empty strings inside our translation file
      const value = !row[lang]?.trim() ? undefined : row[lang]
      set(locales, [lang, row.location, row.id], value);
    }
  }

  const content = `
    // this file is autogenerated by yarn generate-locales. It is also overwritten in the build.
    // You need the google api secret to build the locales, ask a dev for that =)

    const data = ${JSON.stringify(locales, null, 2)};export default data;`;
  const fileContent = prettier.format(content, { parser: "babel" });

  await fs.writeFileSync("src/locales/data.ts", fileContent);
}

main();
