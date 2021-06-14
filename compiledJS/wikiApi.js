"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiApi = void 0;
const wikiPage_1 = require("./wikiPage");
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Implements API methods of the Wikipedia
 */
class WikiApi {
    /**
     * Enables logging of the requests' informations if
     * the given parameter is true, othervise, disables
     * @param bool value to set
     */
    static setLogging(bool) {
        this.logging = bool;
    }
    /**
     * Requests all linked pages of the given title from the API
     * @see https://en.wikipedia.org/w/api.php?action=help&modules=query%2Blinks
     *
     *
     * @remark
     * It only requests pages with namespace = 0
     * @see https://en.wikipedia.org/wiki/Wikipedia:Namespace for namespace details
     *
     * @param title - title of the wikipedia Page
     */
    static async getAllLinkedPages(title, onlyFirst500) {
        let requestParametrs = generateLinkSearchParams(title);
        if (this.logging)
            console.log(`requesting inner links of: ${title}`);
        let response = await requestWithExpBackoff(requestParametrs);
        let linkedPages = this.parseLinks(response, title);
        if (onlyFirst500)
            return linkedPages;
        while (response.continue) {
            let tempSearchParams = generateLinkSearchParams(title, response.plcontinue);
            response = await requestWithExpBackoff(tempSearchParams);
            linkedPages = linkedPages.concat(this.parseLinks(response, title));
        }
        return linkedPages;
    }
    static async getAllCategories(title) {
        let requestParametrs = generateCategorySearchParams(title);
        if (this.logging)
            console.log(`requesting categories of ${title}`);
        let response = await requestWithExpBackoff(requestParametrs);
        let categories = this.parseCategories(response, title);
        return categories;
    }
    static parseCategories(response, title) {
        try {
            let categories = new Array();
            let pages = response.query.pages;
            for (let p in pages) {
                for (let category of pages[p].categories)
                    categories.push(category.title);
            }
            if (this.logging)
                console.log(`got inner categories of: ${title}`);
            return categories;
        }
        catch (err) {
            if (this.logging)
                console.log(`Can't get inner categories of: ${title}, probably page is empty`);
            return [];
        }
    }
    static parseLinks(response, title) {
        try {
            let linkedPages = new Array();
            let pages = response.query.pages;
            for (let p in pages) {
                for (let l of pages[p].links) {
                    linkedPages.push(new wikiPage_1.wikiPage(l.title));
                }
            }
            if (this.logging)
                console.log(`got inner links of: ${title}`);
            return linkedPages;
        }
        catch (err) {
            if (this.logging)
                console.log(`Can't get inner links of: ${title}, probably page is empty`);
            return [];
        }
    }
}
exports.WikiApi = WikiApi;
WikiApi.logging = false;
const API_URL = "https://en.wikipedia.org/w/api.php?";
/**
 * User-Agent header,
 * @see https://www.mediawiki.org/wiki/API:Etiquette#The_User-Agent_header for details
 */
const HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": " wikiracer/0.1 (https://yhtiyar.github.io; sahatovyhtyyar@gmail.com) generic-library/0.0"
};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Generates url parameters for the API request that
 * represents links of the page.
 * @param title - page title
 */
function generateLinkSearchParams(title, plcontinue) {
    let params = new URLSearchParams({
        origin: "*",
        action: "query",
        format: "json",
        prop: "links",
        pllimit: "500",
        plnamespace: "0",
        titles: title,
    });
    if (plcontinue)
        params.append("plcontinue", plcontinue);
    return params;
}
function generateCategorySearchParams(title) {
    let params = new URLSearchParams({
        origin: "*",
        action: "query",
        format: "json",
        prop: "categories",
        cllimit: "500",
        titles: title,
    });
    return params;
}
/**
 * Makes request to the API with given parameters
 * @param searchParams - parameters of the request
 */
async function apiRequest(searchParams) {
    let querryUrl = API_URL + searchParams;
    let response = await node_fetch_1.default(querryUrl, {
        headers: HEADERS,
    });
    let json = await response.json();
    return json;
}
/**
 * Makes request with Exponential backoff
 * @see https://en.wikipedia.org/wiki/Exponential_backoff for details
 * @param searchParams - parameters of the request
 */
async function requestWithExpBackoff(searchParams) {
    const delayCofficient = 0.0512; //51.2 microseconds in milliseconds
    let expCofficient = 0;
    while (true) {
        try {
            let k = Math.random() * (1 << expCofficient);
            delay(k * delayCofficient);
            let ans = await apiRequest(searchParams);
            return ans;
        }
        catch (err) {
            expCofficient++;
        }
    }
}
