"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Agents_1 = require("./agents/Agents");
const wikiPage_1 = require("./wikiPage");
const argparse_1 = require("argparse");
function parseTitle(url) {
    url = decodeURI(url);
    url = url.replace(/_/g, " ");
    let splitted = url.split('/wiki/');
    if (splitted.length !== 2)
        throw new Error(`Probably not wiki url : ${url}`);
    return splitted[1];
}
class Test {
    constructor(startUrl, endUrl) {
        this.startUrl = startUrl;
        this.endUrl = endUrl;
    }
}
//very easy to find
const HITLER = "https://en.wikipedia.org/wiki/Adolf_Hitler";
const UNITED_NATIONS = "https://en.wikipedia.org/wiki/United_Nations";
const RUSSIA = "https://en.wikipedia.org/wiki/Russia";
//Medium
const TURKMENABAT = "https://en.wikipedia.org/wiki/T%C3%BCrkmenabat";
const BOF_KURSK = "https://en.wikipedia.org/wiki/Battle_of_Kursk";
const ALHOREZMI = "https://en.wikipedia.org/wiki/Muhammad_ibn_Musa_al-Khwarizmi";
//extremely hard 
const BANANAMAN = "https://en.wikipedia.org/wiki/Bananaman";
const HOT_POCKETS = "https://en.wikipedia.org/wiki/Hot_Pockets";
const MYSTERY_SEEKER = "https://en.wikipedia.org/wiki/Mystery_Seeker";
let tests = [];
//Random start pages
tests.push(new Test("https://en.wikipedia.org/wiki/Cycling_at_the_2004_Summer_Paralympics_%E2%80%93_Men%27s_individual_pursuit_(B1%E2%80%933)", HITLER));
tests.push(new Test("https://en.wikipedia.org/wiki/Asabea_Cropper", UNITED_NATIONS));
tests.push(new Test("https://en.wikipedia.org/wiki/Sanford%E2%80%93Brown", RUSSIA));
tests.push(new Test("https://en.wikipedia.org/wiki/PCC_Community_Markets", TURKMENABAT));
tests.push(new Test("https://en.wikipedia.org/wiki/Beyond_the_Sixth_Seal", BOF_KURSK));
tests.push(new Test("https://en.wikipedia.org/wiki/CORFO", ALHOREZMI));
tests.push(new Test("https://en.wikipedia.org/wiki/Ashbory_bass", BANANAMAN));
tests.push(new Test("https://en.wikipedia.org/wiki/1970_NHL_Amateur_Draft", HOT_POCKETS));
tests.push(new Test("https://en.wikipedia.org/wiki/Isomer_(Proarticulata)", MYSTERY_SEEKER));
async function runTest(agent, test) {
    return await agent.run(new wikiPage_1.wikiPage(parseTitle(test.startUrl)), new wikiPage_1.wikiPage(parseTitle(test.endUrl)));
}
async function runBenchmarkOn(agent, testFrom, testEnd) {
    console.time("Passed all in:");
    for (let i = testFrom; i < testEnd; i++) {
        console.time("Passed subtest in:");
        let res = await runTest(agent, tests[i]);
        console.log(`Found in ${res.length} steps`);
        res.forEach(el => console.log(el));
        console.timeEnd("Passed subtest in:");
    }
    console.timeEnd("Passed all in:");
    process.exit(0);
}
const argParser = new argparse_1.ArgumentParser({
    description: "benchmark"
});
argParser.add_argument("--agent", {
    choices: ["bfs", "random", "agent_l", "agent_c"],
    required: true
});
argParser.add_argument("--complexity", {
    choices: ["easy", "medium", "hard"],
    required: true
});
const args = argParser.parse_args();
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
switch (args.complexity) {
    case "easy":
        runBenchmarkOn(agent, 0, 3);
        break;
    case "medium":
        runBenchmarkOn(agent, 3, 6);
        break;
    case "hard":
        runBenchmarkOn(agent, 6, 9);
        break;
}
