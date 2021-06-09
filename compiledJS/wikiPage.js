"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiPage = void 0;
const wikiApi_1 = require("./wikiApi");
const wikiUrl = "https://en.wikipedia.org/wiki/";
class wikiPage {
    constructor(title) {
        this.title = title;
    }
    getTitle() {
        return this.title;
    }
    getUrl() {
        return wikiUrl + this.getTitle();
    }
    async getAllLinkedPages() {
        if (this.links)
            return this.links;
        this.links = await wikiApi_1.getAllLinkedTitles(this.title);
        return this.links;
    }
}
exports.wikiPage = wikiPage;
