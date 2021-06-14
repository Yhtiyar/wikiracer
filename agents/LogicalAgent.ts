import { Agent, backtracePath } from "./Agents";
import { wikiPage } from "../wikiPage";
import { WikiApi } from "../wikiApi";

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
export abstract class LogicalAgent implements Agent {

    /**
     * Familiratity distance, the less it is, the more familiar l and r should be
     * 
     * @remark
     * For better performance, please use uniform distrubution [0, 100] as answer
     * 0 - closest
     * 100 - farthest
     * @param l - wikipedia page
     * @param r - wikipedia page
     */
    abstract familiarityDistance(l : wikiPage, r : wikiPage) : number;
    
    /**
     *  Please @see {@link BfsAgent run} method, for explanation
     */
    run = async(startPage: wikiPage, endPage: wikiPage): Promise<string[]> => {
        let visitedMap = new Map <String, Boolean>();
        let queue = new PriorityQueue<wikiPage>();
        let parentMap = new Map<String, String>();

        while(queue.size() > 0) {
            let toVisit = queue.pop();

            if (!toVisit) {
                throw new Error("Something went wrong, toVisit is null");
            }

            if (visitedMap.get(toVisit.getTitle()))
                continue;
            
            let linkedPages = await toVisit.getAllLinkedPages();
            for (const l of linkedPages) {
                if (visitedMap.get(l.getTitle()))
                     continue;
                parentMap.set(l.getTitle(), toVisit.getTitle());

                if (l.getTitle() == endPage.getTitle()) {
                    WikiApi.setLogging(false);
                    return backtracePath(startPage.getTitle(), endPage.getTitle(), parentMap);
                }
               
                let distance = this.familiarityDistance(toVisit, endPage);
                queue.push(l, distance);
                let best_distance = queue.frontPriority();
                if (best_distance == null)
                    throw new Error("p_queue front prority is null");
                let delta = distance - best_distance; 
                
                setTimeout(()=> l.getAllLinkedPages(), delta * 10)
                
            }
        }

        throw new Error("Method not implemented.");
    }
    
}