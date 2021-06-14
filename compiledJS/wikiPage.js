"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiPage = void 0;
const wikiApi_1 = require("./wikiApi");
const WIKI_URL = "https://en.wikipedia.org/wiki/";
/**
 * Represents the wikipedia page.
 */
class wikiPage {
    /**
     * Creates new wikiPage
     * @param title - title of the wikipedia page
     */
    constructor(title) {
        this.title = title;
    }
    /**
     * Title of the wikipedia page
     */
    getTitle() {
        return this.title;
    }
    /**
     * All wikiPages that are linked in the current wikiPage
     *
     * @remarks
     * Only one request to the API will be made. Result will be cached in memory
     */
    async getAllLinkedPages(onlyFirst500) {
        if (this.links != undefined)
            return this.links;
        return wikiApi_1.WikiApi.getAllLinkedPages(this.title, onlyFirst500).then(res => {
            this.links = res;
            return res;
        });
    }
    /**
     * URL to the wikipedia page
     * @param title -  title of the page
     */
    static makeUrl(title) {
        return encodeURI(WIKI_URL + title);
    }
}
exports.wikiPage = wikiPage;
