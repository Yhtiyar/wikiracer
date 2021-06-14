import {Agent, BfsAgent, RandomAgent} from './agents/Agents';
import { wikiPage } from './wikiPage';
import { WikiApi } from './wikiApi';
import { ArgumentParser } from 'argparse';

function parseTitle(url : string) : string {
    url = decodeURI(url);
    url = url.replace(/_/g, " ")
    let splitted = url.split('/wiki/');
    if (splitted.length !== 2)
        throw new Error(`Probably not wiki url : ${url}`);
    return splitted[1];
}

class Test {
    startUrl : string;
    endUrl : string;
    constructor (startUrl : string, endUrl : string) {
        this.startUrl =  startUrl;
        this.endUrl = endUrl;
    }
}

//very easy to find
const HITLER = "https://en.wikipedia.org/wiki/Adolf_Hitler"
const UNITED_NATIONS = "https://en.wikipedia.org/wiki/United_Nations";
const RUSSIA = "https://en.wikipedia.org/wiki/Russia"
//Medium
const TURKMENABAT = "https://en.wikipedia.org/wiki/T%C3%BCrkmenabat"
const BOF_KURSK = "https://en.wikipedia.org/wiki/Battle_of_Kursk";
const ALHOREZMI = "https://en.wikipedia.org/wiki/Muhammad_ibn_Musa_al-Khwarizmi";
//extremely hard 
const BANANAMAN = "https://en.wikipedia.org/wiki/Bananaman";
const HOT_POCKETS = "https://en.wikipedia.org/wiki/Hot_Pockets";
const MYSTERY_SEEKER = "https://en.wikipedia.org/wiki/Mystery_Seeker";

let tests : Test[] = [];
//Random start pages
tests.push(new Test("https://en.wikipedia.org/wiki/The_Family_Corleone", HITLER));
tests.push(new Test("https://en.wikipedia.org/wiki/ANSI_C", UNITED_NATIONS));
tests.push(new Test("https://en.wikipedia.org/wiki/Zigzag", RUSSIA));

tests.push(new Test("https://en.wikipedia.org/wiki/PCC_Community_Markets", TURKMENABAT));
tests.push(new Test("https://en.wikipedia.org/wiki/Beyond_the_Sixth_Seal", BOF_KURSK));
tests.push(new Test("https://en.wikipedia.org/wiki/CORFO", ALHOREZMI));

tests.push(new Test("https://en.wikipedia.org/wiki/Ashbory_bass", BANANAMAN));
tests.push(new Test("https://en.wikipedia.org/wiki/1970_NHL_Amateur_Draft", HOT_POCKETS));
tests.push(new Test("https://en.wikipedia.org/wiki/Isomer_(Proarticulata)", MYSTERY_SEEKER));

async function runTest(agent : Agent, test : Test) {
    return await agent.run(new wikiPage(parseTitle(test.startUrl)), new wikiPage(parseTitle(test.endUrl)));
}

async function runBenchmark(agent : Agent, testFrom : number, testEnd : number) {
    console.time("Passed all in:");
    for (let i = testFrom; i < testEnd; i++) { 
        console.time("Passed subtest in:");
        let res = await runTest(agent, tests[i]);
        console.log(`Found in ${res.length} steps`)
        res.forEach(el => console.log(el));
        console.timeEnd("Passed subtest in:");
    }
    console.timeEnd("Passed all in:");
    process.exit(0);
    
}

const argParser = new ArgumentParser({
    description : "benchmark"
});

argParser.add_argument("--agent", {choices : ["bfs", "random"],  required : true});
argParser.add_argument("--complexity", {choices : ["easy", "medium", "hard"], required : true});

const args = argParser.parse_args();

let agent : Agent;
switch(args.agent) {
    case "bfs" : agent = new BfsAgent(); break;
    case "random" : agent = new RandomAgent(); break; 
    default : throw new Error("Unknown agent")
}

switch(args.complexity) {
    case "easy" : runBenchmark(agent, 0, 3); break;
    case "medium" : runBenchmark(agent, 3, 5); break;
    case "hard" : runBenchmark(agent, 6, 9); break;
}

