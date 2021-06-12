"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiPage = void 0;
const wikiApi_1 = require("./wikiApi");
const WIKI_URL = "https://en.wikipedia.org/wiki/";
class wikiPage {
    constructor(title) {
        this.title = title;
    }
    getTitle() {
        return this.title;
    }
    async getAllLinkedPages() {
        if (this.links != undefined)
            return this.links;
        return wikiApi_1.WikiApi.getAllLinkedTitles(this.title).then(res => {
            this.links = res;
            return res;
        });
    }
    static makeUrl(title) {
        return encodeURI(WIKI_URL + title);
    }
}
exports.wikiPage = wikiPage;
