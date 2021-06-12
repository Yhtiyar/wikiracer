import {ArgumentParser} from 'argparse';
import {Agent, BfsAgent, RandomAgent} from './Agents';
import { wikiPage } from './wikiPage';
import { WikiApi } from './wikiApi';


function parseTitle(url : string) : string {
    url = decodeURI(url);
    url = url.replace(/_/g, " ")
    let splitted = url.split('/wiki/');
    if (splitted.length !== 2)
        throw new Error(`Probably not wiki url : ${url}`);
    return splitted[1];
}

function runWikiRacer(agent : Agent, startTitle : string, endTitle : string) {
    console.log(`Start page title : ${startTitle}`);
    console.log(`End page title : ${endTitle}`)

    if (startTitle == endTitle) {
        console.log("Start page is same as end page\n", wikiPage.makeUrl(startTitle));
        return;
    }
    agent.run(new wikiPage(startTitle), new wikiPage(endTitle))
    .then((urls) => {
        console.log(`Found page in ${urls.length} steps:`);
        urls.forEach(el => console.log(el))
        process.exit(1);
    })
}
//WikiApi.setLogging(true);
//console.log("Testing example : ");
//runWikiRacer(new BfsAgent(), parseTitle("https://en.wikipedia.org/wiki/Superfine_Films"), parseTitle("https://en.wikipedia.org/wiki/Adolf_Hitler"));


const argParser = new ArgumentParser({
    description : "wikiracer"
});
argParser.add_argument('-s', '--start', {help: 'wiki page url, where to start', metavar: "startPage",   default: "https://en.wikipedia.org/wiki/Superfine_Films"});
argParser.add_argument('-e', '--end', {help: 'wiki page url, where to end', metavar :"endPage",  default: "https://en.wikipedia.org/wiki/Adolf_Hitler"});
argParser.add_argument('--log', {action : 'store_true'})

const args = argParser.parse_args();
console.log(args);
WikiApi.setLogging(args.log);
runWikiRacer(new BfsAgent(), parseTitle(args.start), parseTitle(args.end));