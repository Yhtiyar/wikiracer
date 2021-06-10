import {Agent, BfsAgent, RandomAgent} from './Agents';
import { wikiPage } from './wikiPage';

function parseTitle(url : string) : string {
    url = decodeURI(url);
    
    let splitted = url.split('/wiki/');
    if (splitted.length !== 2)
        throw new Error(`Probably not wiki url : ${url}`);
    return splitted[1];
}

function runWikiRacer(agent : Agent, startTitle : string, endTitle : string) {
    agent.run(new wikiPage(startTitle), new wikiPage(endTitle))
    .then((urls) => {
        console.log(`Found page in ${urls.length} steps:`);
        urls.forEach(el => console.log(el))
    })
}

var args = process.argv.slice(2);
console.log("Testing example : ");
runWikiRacer(new BfsAgent(), parseTitle("https://en.wikipedia.org/wiki/Battle_of_Cr%C3%A9cy"), parseTitle("https://en.wikipedia.org/wiki/Wehrmacht"));

//if (args.length !== 2)
//    throw new Error("Wrong number of arguments");

//runWikiRacer(new BfsAgent(), parseTitle(args[0]), parseTitle(args[1]));
