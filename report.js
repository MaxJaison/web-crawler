const printReport = (pages) => {
  console.log("Report is starting");
  const report = Object.entries(pages)
    .sort((pageA, pageB) => pageB[1] - pageA[1])
    .map((page) => `Found ${page[1]} internal links to ${page[0]}`)
    .forEach((line) => console.log(line));
};

module.exports = {
  printReport,
};
