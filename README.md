# Wikirace game bots
Implementation of various bots that will play/solve [wikirace-game](https://en.wikipedia.org/wiki/Wikipedia:Wikirace). In short, given seeking article,
you need to find from other start article (depending on rules, maybe randomly chosed) as fast as you can by article links in page.

## Contents
- [How to use](#how-to-use)
- [Agents](#agents)
- [Fast mode](#fast-mode)
- [Benchmark](#agents-benchmark)

## How to use
#### Requirments:
1. Node.js  version > 14.0

#### Optional requirments:
1. Typescript (tsc for building project yourself)

### Getting source code and installing dependencies:
* `git clone https://github.com/Yhtiyar/wikiracer.git`
* `cd wikiracer/`
* `npm i package.json`

### Running: 
`npm run wikiracer -- --start start_page_url --end end_page_url --agent agent_name`

**Important** : **Urls should be in quotes!**

 Example:
 
`npm run wikiracer -- --start "https://en.wikipedia.org/wiki/Asabea_Cropper" --end "https://en.wikipedia.org/wiki/Adolf_Hitler" --agent bfs`
#### Run arguments:
1. `--start "start_page"`  Wikipedia article where game starts
2. `--end "end_page"` Seeking article
3. `--agent agent_name`  Name of the agent (bot) that will play game. See avaible agent [here](#agents)
4. Optional arguments:
  * `--log` Logs api request details
  * `--disable_fast_mode` Disables [fast mode](#fast-mode)

### Building (optional):
`npm run build` - project will build to `compiledJS/` directory

## Agents
### Random agent
Chooses random link everytime. You can use it to check if you lucky enough.

### Bfs agent
Searches article by [BFS algorithm](https://en.wikipedia.org/wiki/Breadth-first_search). Works really fast to seach famous articles, as
some famous politicians, countires. Struggles with seaarching specific articles.

### Agent_C 
Improved search with priority queue, the articles that are familiar to seeking article will be looked first. Familiarty in this agent between 2 articles 
is defined as : number of categories that contain both articles. Works slow to search famous articles compared to Bfs agent, however works good in searching
rare articles.

### Agent_L
Experimental agent similar to Agent_C, however [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) is used to measure familiarity. Average Levenshtein distance between articles of 2 pages represents how familiar are articles. But, distance measuring creates bottleneck, so it becmomes really slow. Not recommended to use it.

## Fast mode
Every agent is in fast mode by default, it means it will search not more that 500 (first lexographically sorted) articles in each page. Since there some pages
with thousands of links, fast mode will improve agents performance. Searching works fine in this mode. You can disable it manually, see program run arguments.

## Agents benchmark
I have developed tests to test agents speed. Test consist of 3 categories.
- Easy, with famous articles.
- Middle, not popular articles.
- Hard, with very specific articles.

Each category consists of 3 tests. See all tests [here](https://github.com/Yhtiyar/wikiracer/blob/main/benchmark.ts)

### Benchmark results
I have set time limit  10 minutes for Easy, 30 minutes for Middle tests and 1 hour for hard tests. I have only ran benchmark on BFS agent and Agent_C. (It is obvious that other 2 agents will fail time limit). 
| Agent         | Easy             | Middle   |Hard    |
| ------------- |:----------------:|:--------:|:------:|
| BFS           | 8.524s           | tl fail  |tl fail |
| Agent_C       | 30m:27s (tl fail)|  3m:58s  |45m:36s |    

[Here](https://github.com/Yhtiyar/wikiracer/tree/main/benchmark-logs) are becnhmark logs.
#### Counclusion:
- Use BFS agent for very popular articles
- Use Agent_C fot others
