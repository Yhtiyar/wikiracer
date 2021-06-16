import { Agent, backtracePath } from "./Agents";
import { WikiPage } from "../wikiPage";
import { WikiApi } from "../wikiApi";
import {PriorityQueue} from './PriorityQueue';
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
     * @param l - wikipedia page
     * @param r - wikipedia page
     */
    abstract familiarityDistance(l : WikiPage, r : WikiPage) : Promise<number>;
    
    private fastMode = true;
    public turnOffFastMode() {
        this.fastMode = false;
    }

    async run(startPage: WikiPage, endPage: WikiPage): Promise<string[]> {
        let visitedMap = new Map <string, boolean>();
        let queue = new PriorityQueue<WikiPage>();
        let parentMap = new Map<string, string>();

        let dist = await this.familiarityDistance(startPage, endPage);
        queue.push(startPage, dist)

        while(queue.size() > 0) {
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
                    WikiApi.setLogging(false);
                    return backtracePath(startPage.getTitle(), endPage.getTitle(), parentMap);
                }
               
                let distance = await this.familiarityDistance(l, endPage);
                queue.push(l, distance);
                //Requesting async-ly inner links with some delay
                setTimeout(()=> {l.getAllLinkedPages(this.fastMode)}, 200)    //200 ms delay works fine, but it would be better find
                                                                                //some equation with distance
                
            }
        }

        throw new Error("Path not found.");
    }
    
}