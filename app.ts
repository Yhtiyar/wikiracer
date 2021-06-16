import {ArgumentParser} from 'argparse';
import {Agent, BfsAgent, RandomAgent, Agent_L, Agent_C} from './agents/Agents';
import { WikiPage } from './wikiPage';
import { WikiApi } from './wikiApi';

/**
 * Runs wikiracer with given agent, start title, end title,
 * prints urls after path found.
 * 
 * @param agent - agent
 * @param startTitle - starting wiki article title
 * @param endTitle - ending wiki articel title
 */
function runWikiRacer(agent : Agent, startTitle : string, endTitle : string) {
    console.log(`Start page title : ${startTitle}`);
    console.log(`End page title : ${endTitle}`)

    if (startTitle == endTitle) {
        console.log("Start page is same as end page\n", WikiPage.makeUrl(startTitle));
        return;
    }
    agent.run(new WikiPage(startTitle), new WikiPage(endTitle))
    .then((urls) => {
        console.log(`Found page in ${urls.length} steps:`);
        urls.forEach(el => console.log(el))
        process.exit(1);
    })
}

const argParser = new ArgumentParser({
    description : "wikiracer"
});
argParser.add_argument('-s', '--start', {
    help: 'wiki page url, where to start', 
    metavar: "startPage",   
    required : true
});
argParser.add_argument('-e', '--end', {
    help: 'wiki page url, where to end', 
    metavar :"endPage",  
    required : true
});
argParser.add_argument('-a', '--agent', {
    help: 'agent name',
    choices : ["bfs", "random", "agent_l", "agent_c"],  
    required : true
})
argParser.add_argument('--log', {
    action : 'store_true'
})

argParser.add_argument('--disable_fast_mode', {
    action : 'store_true'
})

const args = argParser.parse_args();
    
let agent : Agent;
switch(args.agent) {
    case "bfs" : 
        agent = new BfsAgent(); 
        break;
    case "random" : 
        agent = new RandomAgent(); 
        break; 
    case "agent_l" : 
        agent = new Agent_L();
        break;
    case "agent_c" :
        agent = new Agent_C();
        break;
    default : 
        throw new Error("Unknown agent")
}

WikiApi.setLogging(args.log);

if (args["disable_fast_mode"])
    agent.turnOffFastMode();

runWikiRacer(agent, WikiPage.parseTitle(args.start), WikiPage.parseTitle(args.end));