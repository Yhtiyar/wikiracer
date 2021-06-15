# Wikirace game bots
Implementation of various bots that will play/solve [wikirace-game](https://en.wikipedia.org/wiki/Wikipedia:Wikirace).

## How to use
#### Requirments:
1. Node.js  version > 14.0

#### Optional requirments:
1. Typescript (tsc for building yourself)

### Getting source code and installing dependencies:
* `git clone https://github.com/Yhtiyar/wikiracer.git`
* `cd wikiracer/`
* `npm i package.json`

### Running: 
`npm run wikiracer -- --start start_page_url --end end_page_url --agent agent_name`

**Important** : Urls should be in quotes

 Example:
 
`npm run wikiracer -- --start "https://en.wikipedia.org/wiki/Asabea_Cropper" --end "https://en.wikipedia.org/wiki/Adolf_Hitler" --agent bfs`

### Building (optional):
`npm run build`
