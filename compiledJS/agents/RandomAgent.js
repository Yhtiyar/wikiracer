"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomAgent = void 0;
const wikiPage_1 = require("../wikiPage");
class RandomAgent {
    constructor() {
        this.fastMode = true;
        this.run = async (startPage, endPage) => {
            let path = [startPage.getTitle()];
            while (true) {
                let linkedPages = await startPage.getAllLinkedPages(this.fastMode);
                for (let page of linkedPages) {
                    if (page.getTitle() == endPage.getTitle()) {
                        path.push(page.getTitle());
                        return path.map(title => wikiPage_1.WikiPage.makeUrl(title));
                    }
                }
                startPage = this.getRandomPage(linkedPages);
                path.push(startPage.getTitle());
            }
        };
    }
    turnOffFastMode() {
        this.fastMode = false;
    }
    getRandomPage(pages) {
        return pages[Math.floor(Math.random() * pages.length)];
    }
}
exports.RandomAgent = RandomAgent;
