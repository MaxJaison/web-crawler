const { argv } = require("node:process");
const { crawlPage } = require("./crawl");
const { printReport } = require("./report");

async function main() {
  if (argv.slice(2).length === 1) {
    const baseURL = process.argv[2];
    console.log(`Crawler started with ${baseURL}`);
    const pages = await crawlPage(baseURL, baseURL, {});
    printReport(pages);
  } else {
    console.error("Wrong CLI command");
    process.exit(1);
  }
}

main();
