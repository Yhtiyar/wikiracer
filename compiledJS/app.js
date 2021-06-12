"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const Agents_1 = require("./Agents");
const wikiPage_1 = require("./wikiPage");
const wikiApi_1 = require("./wikiApi");
function parseTitle(url) {
    url = decodeURI(url);
    url = url.replace(/_/g, " ");
    let splitted = url.split('/wiki/');
    if (splitted.length !== 2)
        throw new Error(`Probably not wiki url : ${url}`);
    return splitted[1];
}
function runWikiRacer(agent, startTitle, endTitle) {
    console.log(`Start page title :${startTitle}`);
    console.log(`End page title :${endTitle}`);
    if (startTitle == endTitle) {
        console.log("Start page is same as end page\n", wikiPage_1.wikiPage.makeUrl(startTitle));
        return;
    }
    agent.run(new wikiPage_1.wikiPage(startTitle), new wikiPage_1.wikiPage(endTitle))
        .then((urls) => {
        console.log(`Found page in ${urls.length} steps:`);
        urls.forEach(el => console.log(el));
        process.exit(1);
    });
}
//WikiApi.setLogging(true);
//console.log("Testing example : ");
//runWikiRacer(new BfsAgent(), parseTitle("https://en.wikipedia.org/wiki/Superfine_Films"), parseTitle("https://en.wikipedia.org/wiki/Adolf_Hitler"));
const argParser = new argparse_1.ArgumentParser({
    description: "wikiracer"
});
argParser.add_argument('-s', '--start', { help: 'wiki page url, where to start', metavar: "startPage", default: "https://en.wikipedia.org/wiki/Superfine_Films" });
argParser.add_argument('-e', '--end', { help: 'wiki page url, where to end', metavar: "endPage", default: "https://en.wikipedia.org/wiki/Adolf_Hitler" });
argParser.add_argument('--log', { action: 'store_true' });
const args = argParser.parse_args();
console.log(args);
wikiApi_1.WikiApi.setLogging(args.log);
runWikiRacer(new Agents_1.BfsAgent(), parseTitle(args.start), parseTitle(args.end));
