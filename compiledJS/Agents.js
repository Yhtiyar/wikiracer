"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomAgent = exports.BfsAgent = void 0;
const wikiPage_1 = require("./wikiPage");
const wikiApi_1 = require("./wikiApi");
class BfsAgent {
    constructor() {
        this.run = async (startPage, endPage) => {
            let visitedMap = new Map();
            let parent = new Map();
            let queue = [startPage];
            while (queue.length > 0) {
                let toVisit = queue.shift();
                if (!toVisit) {
                    throw new Error("Unexpected error, actually, it should never happen");
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
                        wikiApi_1.WikiApi.setLogging(false);
                        return this.backTracePath(startPage.getTitle(), endPage.getTitle(), parent);
                    }
                    queue.push(l);
                    setTimeout(() => l.getAllLinkedPages(), queue.length * 10);
                }
            }
            throw new Error("Path not found");
        };
    }
    backTracePath(startPageUrl, endPageUrl, parent) {
        let path = [endPageUrl];
        while (path[path.length - 1] != startPageUrl) {
            let nodeParent = parent.get(path[path.length - 1]);
            if (!nodeParent)
                throw new Error("Cannot backtrace path");
            path.push(nodeParent.toString());
        }
        return path.reverse().map(title => wikiPage_1.wikiPage.makeUrl(title));
    }
    async addChildren() {
    }
}
exports.BfsAgent = BfsAgent;
class RandomAgent {
    constructor() {
        this.run = async (startPage, endPage) => {
            let path = [startPage.getTitle()];
            while (true) {
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
        };
    }
    getRandomPage(pages) {
        return pages[Math.floor(Math.random() * pages.length)];
    }
}
exports.RandomAgent = RandomAgent;
