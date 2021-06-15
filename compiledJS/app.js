"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const Agents_1 = require("./agents/Agents");
const wikiPage_1 = require("./wikiPage");
const wikiApi_1 = require("./wikiApi");
/**
 * Runs wikiracer with given agent, start title, end title,
 * prints urls after path found.
 *
 * @param agent - agent
 * @param startTitle - starting wiki article title
 * @param endTitle - ending wiki articel title
 */
function runWikiRacer(agent, startTitle, endTitle) {
    console.log(`Start page title : ${startTitle}`);
    console.log(`End page title : ${endTitle}`);
    if (startTitle == endTitle) {
        console.log("Start page is same as end page\n", wikiPage_1.WikiPage.makeUrl(startTitle));
        return;
    }
    agent.run(new wikiPage_1.WikiPage(startTitle), new wikiPage_1.WikiPage(endTitle))
        .then((urls) => {
        console.log(`Found page in ${urls.length} steps:`);
        urls.forEach(el => console.log(el));
        process.exit(1);
    });
}
const argParser = new argparse_1.ArgumentParser({
    description: "wikiracer"
});
argParser.add_argument('-s', '--start', {
    help: 'wiki page url, where to start',
    metavar: "startPage",
    default: "https://en.wikipedia.org/wiki/Superfine_Films"
});
argParser.add_argument('-e', '--end', {
    help: 'wiki page url, where to end',
    metavar: "endPage",
    default: "https://en.wikipedia.org/wiki/Adolf_Hitler"
});
argParser.add_argument('-a', '--all', {
    help: 'agent name',
    choices: ["bfs", "random", "agent_l", "agent_c"],
    required: true
});
argParser.add_argument('--log', {
    action: 'store_true'
});
const args = argParser.parse_args();
wikiApi_1.WikiApi.setLogging(args.log);
let agent;
switch (args.agent) {
    case "bfs":
        agent = new Agents_1.BfsAgent();
        break;
    case "random":
        agent = new Agents_1.RandomAgent();
        break;
    case "agent_l":
        agent = new Agents_1.Agent_L();
        break;
    case "agent_c":
        agent = new Agents_1.Agent_C();
        break;
    default:
        throw new Error("Unknown agent");
}
runWikiRacer(agent, wikiPage_1.WikiPage.parseTitle(args.start), wikiPage_1.WikiPage.parseTitle(args.end));
