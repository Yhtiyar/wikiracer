"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomAgent = exports.BfsAgent = void 0;
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
                if (toVisit.getUrl() == endPage.getUrl()) {
                    return this.backTracePath(startPage.getUrl(), endPage.getUrl(), parent);
                }
                if (visitedMap.get(toVisit.getTitle()))
                    continue;
                visitedMap.set(toVisit.getUrl(), true);
                let linkedPages = await toVisit.getAllLinkedPages();
                for (const l of linkedPages) {
                    parent.set(l.getUrl(), toVisit.getUrl());
                    queue.push(l);
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
        return path.reverse();
    }
}
exports.BfsAgent = BfsAgent;
class RandomAgent {
    constructor() {
        this.run = async (startPage, endPage) => {
            let path = new Array(startPage.getUrl());
            while (startPage.getTitle() != endPage.getTitle()) {
                let linkedPages = await startPage.getAllLinkedPages();
                startPage = this.getRandomPage(linkedPages);
                path.push(startPage.getUrl());
            }
            return path;
        };
    }
    getRandomPage(pages) {
        return pages[Math.floor(Math.random() * pages.length)];
    }
}
exports.RandomAgent = RandomAgent;
