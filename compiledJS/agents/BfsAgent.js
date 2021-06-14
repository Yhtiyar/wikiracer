"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BfsAgent = void 0;
const Agents_1 = require("./Agents");
const wikiApi_1 = require("../wikiApi");
/**
 *  Agent that will seach url with BFS algorithm
 *
 * @see https://en.wikipedia.org/wiki/Breadth-first_search for details
 */
class BfsAgent {
    constructor() {
        this.run = async (startPage, endPage) => {
            let visitedMap = new Map(); //For storing if we have visisted given page
            let parentMap = new Map(); //For storing of the page where given page is linked, using its title to hash, 
            //since it is smaller than URL, it should be hashed faster
            let queue = [startPage];
            while (queue.length > 0) {
                let toVisit = queue.shift();
                if (!toVisit) {
                    throw new Error("Unexpected error, actually, it should never happen");
                }
                let linkedPages = await toVisit.getAllLinkedPages(true);
                for (const l of linkedPages) {
                    if (visitedMap.get(l.getTitle()))
                        continue;
                    visitedMap.set(l.getTitle(), true);
                    parentMap.set(l.getTitle(), toVisit.getTitle());
                    if (l.getTitle() == endPage.getTitle()) {
                        /**If the page is what we are seeking, then backtrace  the path*/
                        wikiApi_1.WikiApi.setLogging(false); // In order to block logging of async querries that have been sended
                        return Agents_1.backtracePath(startPage.getTitle(), endPage.getTitle(), parentMap);
                    }
                    queue.push(l);
                    /**
                     *  Lets querry all children of the page "l",
                     *  so we will not wait(all children will be  saved, @see wikiPage)
                     *  when l becomes 1st in queue. But, since async and sync works all
                     *  in 1 thread, it will effect performance.
                     *  So lets querry it with some delay, depending on queue length
                     */
                    let delay = queue.length * 10 + linkedPages.length; // 10 is here just some magic number, not mathematicly proved to be best,
                    // just found it with testing, works fine.
                    setTimeout(() => l.getAllLinkedPages(true), delay);
                }
            }
            throw new Error("Path not found");
        };
    }
}
exports.BfsAgent = BfsAgent;
