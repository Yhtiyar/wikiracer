"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalAgent = void 0;
const Agents_1 = require("./Agents");
const wikiApi_1 = require("../wikiApi");
const PriorityQueue_1 = require("./PriorityQueue");
/**
 * Same as {@link BfsAgent}, but prority queue used, to
 * make logical search.
 *
 * Pripority p(x) : distance between page x and searching page, that represents connection between 2 pages.
 *
 * The less p(x) is, the more familiar should be x and searchig page.
 *
 * Queue is sorted with elements priorities, which means elements with less p(x)
 * will be visited first.
 *
 * @remark
 * Every Agent that extends this class, should implement familiarityDistance(l, r),
 * the less of the result of this function is, the more connected l and r should be.
 */
class LogicalAgent {
    constructor() {
        this.fastMode = true;
    }
    turnOffFastMode() {
        this.fastMode = false;
    }
    async run(startPage, endPage) {
        let visitedMap = new Map();
        let queue = new PriorityQueue_1.PriorityQueue();
        let parentMap = new Map();
        let dist = await this.familiarityDistance(startPage, endPage);
        queue.push(startPage, dist);
        while (queue.size() > 0) {
            let toVisit = queue.pop();
            if (!toVisit) {
                throw new Error("Something went wrong, toVisit is null");
            }
            let linkedPages = await toVisit.getAllLinkedPages(this.fastMode);
            /**Requesting pages categories async-ly, so we will not wait when we need **/
            for (let i = 0; i < linkedPages.length; i++) {
                if (visitedMap.get(linkedPages[i].getTitle()))
                    continue;
                setTimeout(() => linkedPages[i].getCategories(), i * 2); //2 - is found to be best coficient by testing performance
            }
            for (const l of linkedPages) {
                if (visitedMap.get(l.getTitle()))
                    continue;
                visitedMap.set(l.getTitle(), true);
                parentMap.set(l.getTitle(), toVisit.getTitle());
                if (l.getTitle() == endPage.getTitle()) {
                    wikiApi_1.WikiApi.setLogging(false);
                    return Agents_1.backtracePath(startPage.getTitle(), endPage.getTitle(), parentMap);
                }
                let distance = await this.familiarityDistance(l, endPage);
                queue.push(l, distance);
                //Requesting async-ly inner links with some delay
                setTimeout(() => { l.getAllLinkedPages(this.fastMode); }, 200); //200 ms delay works fine, but it would be better find
                //some equation with distance
            }
        }
        throw new Error("Path not found.");
    }
}
exports.LogicalAgent = LogicalAgent;
