import { wikiPage } from "./wikiPage";
import { WikiApi } from "./wikiApi";

export interface Agent {
    run(startPage : wikiPage, endPage : wikiPage) : Promise<string[]>;
}

export class BfsAgent implements Agent {
   
    private backTracePath(startPageUrl: string, endPageUrl: string, parent : Map<String, String>) {
        let path = [endPageUrl];
        while (path[path.length - 1] != startPageUrl) {
            let nodeParent = parent.get(path[path.length - 1]);
            if (!nodeParent)
                throw new Error("Cannot backtrace path");
            path.push(nodeParent.toString());
        }
        return path.reverse().map(title => wikiPage.makeUrl(title));
    }

    private async addChildren() {

    }

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
                    return this.backTracePath(startPage.getTitle(), endPage.getTitle(), parent);
                }
                queue.push(l);
                setTimeout(()=> l.getAllLinkedPages(), queue.length * 10)
            }
        }
        throw new Error("Path not found");
    }
}

export class RandomAgent implements Agent {
    
    private getRandomPage(pages : wikiPage[]) {
        return pages[Math.floor(Math.random() * pages.length)];
    }

    run = async (startPage: wikiPage, endPage: wikiPage): Promise<string[]> => {
        let path = [startPage.getTitle()];

        while(true) {
            let linkedPages = await startPage.getAllLinkedPages();
            for (let page of linkedPages) {
                if (page.getTitle() == endPage.getTitle()) {
                    path.push(page.getTitle());
                    return path;
                }
            }
            startPage = this.getRandomPage(linkedPages);
            path.push(startPage.getTitle());
        }
        //TODO : return url
    }
}
