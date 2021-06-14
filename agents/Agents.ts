import { wikiPage } from "../wikiPage";

export interface Agent {
    run(startPage : wikiPage, endPage : wikiPage) : Promise<string[]>;
}

export {BfsAgent} from './BfsAgent';
export {RandomAgent} from './RandomAgent';
export {LogicalAgent} from './LogicalAgent';
export {Agent_L} from './Agent_L';
/**
 * Builds path from start url to end url with the given parent-relation map
 * 
 * If page Y is linked in page X, X is the Y's parent page
 * 
 * @param startPageUrl - page where path should starts
 * @param endPageUrl  - page where path should ends
 * @param parent      - HashMap representing parent page url of the given page url
 */
export function backtracePath(startPageUrl: string, endPageUrl: string, parent : Map<String, String>) {
    let path = [endPageUrl];
    while (path[path.length - 1] != startPageUrl) {
        let nodeParent = parent.get(path[path.length - 1]);
        if (!nodeParent)
            throw new Error("Cannot backtrace path");
        path.push(nodeParent.toString());
    }
    return path.reverse().map(title => wikiPage.makeUrl(title));
}





