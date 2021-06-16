"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiPage = void 0;
const wikiApi_1 = require("./wikiApi");
const WIKI_URL = "https://en.wikipedia.org/wiki/";
/**
 * Represents the wikipedia page. Implements api methods
 */
class WikiPage {
    /**
     * Creates new WikiPage
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
     * All WikiPages that are linked in the current WikiPage
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
     * All categories of the given current WikiPage
     *
     * @remarks
     * Only one request to the API will be made. Result will be cached in memory
     */
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
    /**
     * Parses title of the wikipedia article from URL
     *
     * @param url - url of wikipedia article
     */
    static parseTitle(url) {
        url = decodeURI(url);
        url = url.replace(/_/g, " ");
        let splitted = url.split('/wiki/');
        if (splitted.length !== 2)
            throw new Error(`Probably not wiki url : ${url}`);
        return splitted[1];
    }
}
exports.WikiPage = WikiPage;
