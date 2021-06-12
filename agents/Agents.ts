import { wikiPage } from "../wikiPage";

export interface Agent {
    run(startPage : wikiPage, endPage : wikiPage) : Promise<string[]>;
}

export {BfsAgent} from './BfsAgent';
export {RandomAgent} from './RandomAgent'




