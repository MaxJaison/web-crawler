const { JSDOM } = require("jsdom");
const url = require("node:url");

const normalizeURL = (url) => {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
};

const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = [];
  const dom = new JSDOM(htmlBody);

  const allLinks = dom.window.document.querySelectorAll("a");
  for (const anchor of allLinks) {
    if (anchor.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(anchor.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${anchor.href}`);
      }
    } else {
      try {
        urls.push(new URL(anchor.href).href);
      } catch (err) {
        console.log(`${err.message}: ${anchor.href}`);
      }
    }
  }

  return urls;
};

const crawlPage = async (baseURL, currentURL, pages) => {
  const currentUrlObj = new URL(currentURL);
  const baseUrlObj = new URL(baseURL);

  if (currentUrlObj.hostname !== baseUrlObj.hostname) {
    return pages;
  }

  const normUrl = normalizeURL(currentURL);
  if (pages[normUrl] > 0) {
    pages[normUrl]++;
    return pages;
  }

  pages[normUrl] = 1;

  console.log(`crawling ${currentURL}`);

  let htmlBody = "";
  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(`Got HTTP error, status code: ${response.status}`);
      return;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`Got non-html response: ${contentType}`);
      return pages;
    }
    htmlBody = await response.text();
  } catch (error) {
    console.log(error);
  }

  const urls = getURLsFromHTML(htmlBody, currentURL);
  for (const url of urls) {
    await crawlPage(baseURL, url, pages);
  }
  return pages;
};

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
