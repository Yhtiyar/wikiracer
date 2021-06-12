import { Agent, backtracePath } from "./Agents";
import { wikiPage } from "../wikiPage";
import { WikiApi } from "../wikiApi";

export abstract class LogicalAgent implements Agent {

    abstract familiarityDistance(l : wikiPage, r : wikiPage) : number;
    
    run = async(startPage: wikiPage, endPage: wikiPage): Promise<string[]> => {
        let visitedMap = new Map <String, Boolean>();
        let queue = new PriorityQueue<wikiPage>();
        let parent = new Map<String, String>();

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
                parent.set(l.getTitle(), toVisit.getTitle());

                if (l.getTitle() == endPage.getTitle()) {
                    WikiApi.setLogging(false);
                    return backtracePath(startPage.getTitle(), endPage.getTitle(), parent);
                }

                let distance = this.familiarityDistance(toVisit, endPage);
                queue.push(l, distance);

                setTimeout(()=> l.getAllLinkedPages(), queue.size() * 10)
                
            }
        }

        throw new Error("Method not implemented.");
    }
    
}