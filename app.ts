import {Agent, BfsAgent, RandomAgent} from './Agents';
import { wikiPage } from './wikiPage';
import { WikiApi } from './wikiApi';

function parseTitle(url : string) : string {
    url = decodeURI(url);
    url = url.replace(/_/g, " ")
    let splitted = url.split('/wiki/');
    if (splitted.length !== 2)
        throw new Error(`Probably not wiki url : ${url}`);
    console.log(splitted[1]);
    return splitted[1];
}

function runWikiRacer(agent : Agent, startTitle : string, endTitle : string) {
    if (startTitle == endTitle) {
        console.log(startTitle);
        return;
    }
    agent.run(new wikiPage(startTitle), new wikiPage(endTitle))
    .then((urls) => {
        console.log(`Found page in ${urls.length} steps:`);
        urls.forEach(el => console.log(el))
        process.exit(1);
    })
}
WikiApi.setLogging(true);
var args = process.argv.slice(2);
console.log("Testing example : ");
runWikiRacer(new BfsAgent(), parseTitle("https://en.wikipedia.org/wiki/Superfine_Films"), parseTitle("https://en.wikipedia.org/wiki/Adolf_Hitler"));

//if (args.length !== 2)
//    throw new Error("Wrong number of arguments");

//runWikiRacer(new BfsAgent(), parseTitle(args[0]), parseTitle(args[1]));
