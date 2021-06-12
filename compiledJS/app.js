"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Agents_1 = require("./Agents");
const wikiPage_1 = require("./wikiPage");
const wikiApi_1 = require("./wikiApi");
function parseTitle(url) {
    url = decodeURI(url);
    url = url.replace(/_/g, " ");
    let splitted = url.split('/wiki/');
    if (splitted.length !== 2)
        throw new Error(`Probably not wiki url : ${url}`);
    console.log(splitted[1]);
    return splitted[1];
}
function runWikiRacer(agent, startTitle, endTitle) {
    if (startTitle == endTitle) {
        console.log(startTitle);
        return;
    }
    agent.run(new wikiPage_1.wikiPage(startTitle), new wikiPage_1.wikiPage(endTitle))
        .then((urls) => {
        console.log(`Found page in ${urls.length} steps:`);
        urls.forEach(el => console.log(el));
        process.exit(1);
    });
}
wikiApi_1.WikiApi.setLogging(true);
var args = process.argv.slice(2);
console.log("Testing example : ");
runWikiRacer(new Agents_1.BfsAgent(), parseTitle("https://en.wikipedia.org/wiki/Superfine_Films"), parseTitle("https://en.wikipedia.org/wiki/Adolf_Hitler"));
//if (args.length !== 2)
//    throw new Error("Wrong number of arguments");
//runWikiRacer(new BfsAgent(), parseTitle(args[0]), parseTitle(args[1]));
