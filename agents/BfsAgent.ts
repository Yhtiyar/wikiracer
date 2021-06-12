import {Agent, backtracePath} from './Agents';
import {wikiPage} from '../wikiPage';
import {WikiApi} from '../wikiApi';

export class BfsAgent implements Agent {
   
    run = async(startPage: wikiPage, endPage: wikiPage): Promise<string[]> => {
        let visitedMap = new Map <String, Boolean>();
        let parent = new Map<String, String>();
        let queue = [startPage];
        
        while(queue.length > 0) {
            let toVisit = queue.shift();
            if (!toVisit) {
                throw new Error ("Unexpected error, actually, it should never happen");
            }
            if (visitedMap.get(toVisit.getTitle()))
                continue;
            
            visitedMap.set(toVisit.getTitle(), true);

            let linkedPages = await toVisit.getAllLinkedPages();
            for (const l of linkedPages) {
                if (visitedMap.get(l.getTitle()))
                     continue;
                parent.set(l.getTitle(), toVisit.getTitle());

                if (l.getTitle() == endPage.getTitle()) {
                    WikiApi.setLogging(false);
                    return backtracePath(startPage.getTitle(), endPage.getTitle(), parent);
                }

                queue.push(l);
                setTimeout(()=> l.getAllLinkedPages(), queue.length * 10)
            }
        }
        throw new Error("Path not found");
    }
}
