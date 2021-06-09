import { wikiPage } from "./wikiPage";

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
        return path.reverse();
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
            
            visitedMap.set(toVisit.getUrl(), true);
            let linkedPages = await toVisit.getAllLinkedPages();
            for (const l of linkedPages) {
                parent.set(l.getUrl(), toVisit.getUrl());
                if (l.getUrl() == endPage.getUrl()) {
                    return this.backTracePath(startPage.getUrl(), endPage.getUrl(), parent);
                }
                queue.push(l);
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
        let path = [startPage.getUrl()];

        while(true) {
            let linkedPages = await startPage.getAllLinkedPages();
            for (let page of linkedPages) {
                if (page.getUrl() == endPage.getUrl()) {
                    path.push(page.getUrl());
                    return path;
                }
            }
            startPage = this.getRandomPage(linkedPages);
            path.push(startPage.getUrl());
        }
    }
}
