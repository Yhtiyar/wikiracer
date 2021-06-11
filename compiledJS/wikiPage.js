"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiPage = void 0;
const wikiApi_1 = require("./wikiApi");
const WIKI_URL = "https://en.wikipedia.org/wiki/";
class wikiPage {
    constructor(title) {
        this.title = title;
        this.url = WIKI_URL + this.getTitle();
    }
    getTitle() {
        return this.title;
    }
    getUrl() {
        return this.url;
    }
    async getAllLinkedPages() {
        if (this.links != undefined)
            return this.links;
        this.links = await wikiApi_1.WikiApi.getAllLinkedTitles(this.title);
        return this.links;
    }
}
exports.wikiPage = wikiPage;
