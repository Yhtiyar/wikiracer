import {Agent, backtracePath} from './Agents';
import {wikiPage} from '../wikiPage';
import {WikiApi} from '../wikiApi';

/**
 *  Agent that will seach url with BFS algorithm
 * 
 * @see https://en.wikipedia.org/wiki/Breadth-first_search for details
 */
export class BfsAgent implements Agent {
   
    run = async(startPage: wikiPage, endPage: wikiPage): Promise<string[]> => {

        let visitedMap = new Map <String, Boolean>();   //For storing if we have visisted given page
        let parentMap = new Map<String, String>();      //For storing of the page where given page is linked, using its title to hash, 
                                                        //since it is smaller than URL, it should be hashed faster
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

                parentMap.set(l.getTitle(), toVisit.getTitle());
                /**If the page is what we are seeking, then backtrace  the path*/
                if (l.getTitle() == endPage.getTitle()) {
                    WikiApi.setLogging(false);          // In order to block logging of async querries that have been sended
                    return backtracePath(startPage.getTitle(), endPage.getTitle(), parentMap);
                }

                queue.push(l);
                /**
                 *  Lets querry all children of the page "l",
                 *  so we will not wait(all children will be  saved, @see wikiPage) 
                 *  when l becomes 1st in queue. But, since async and sync works all
                 *  in 1 thread, it will effect performance.
                 *  So lets querry it with some delay, depending on queue length  
                 */
                let delay =  queue.length * 10;  // 10 is here just some magic number, not mathematicly proved to be best,
                                                 // just found it with testing, works fine.
                setTimeout(()=> l.getAllLinkedPages(), delay);
            }
        }
        throw new Error("Path not found");
    }
}
