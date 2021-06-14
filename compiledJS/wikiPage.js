"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiPage = void 0;
const wikiApi_1 = require("./wikiApi");
const WIKI_URL = "https://en.wikipedia.org/wiki/";
/**
 * Represents the wikipedia page. Implements api methods
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
    async getCategories() {
        if (this.categories != undefined)
            return this.categories;
        return wikiApi_1.WikiApi.getAllCategories(this.title).then(res => {
            this.categories = res.map(el => el.slice(9)); //Removing "Category:" prefix
            return this.categories;
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
