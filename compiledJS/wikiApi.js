"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiApi = void 0;
const wikiPage_1 = require("./wikiPage");
const node_fetch_1 = __importDefault(require("node-fetch"));
class WikiApi {
    static setLogging(bool) {
        this.logging = bool;
    }
    static async getAllLinkedTitles(title) {
        let requestParametrs = generateLinkSearchParams(title);
        if (this.logging)
            console.log(`requesting inner links of: ${title}`);
        let response = await requestWithExpBackoff(requestParametrs);
        try {
            let linkedPages = new Array();
            let pages = response.query.pages;
            for (let p in pages) {
                for (let l of pages[p].links) {
                    linkedPages.push(new wikiPage_1.wikiPage(l.title));
                }
            }
            console.log(`got inner links of: ${title}`);
            return linkedPages;
        }
        catch (err) {
            if (this.logging)
                console.log(`Can't get inner links of: ${title}`);
            return [];
        }
    }
}
exports.WikiApi = WikiApi;
const API_URL = "https://en.wikipedia.org/w/api.php?";
const HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": " wikiracer/0.1 (https://yhtiyar.github.io; sahatovyhtyyar@gmail.com) generic-library/0.0"
};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function generateLinkSearchParams(title) {
    return new URLSearchParams({
        origin: "*",
        action: "query",
        format: "json",
        prop: "links",
        pllimit: "500",
        plnamespace: "0",
        titles: title,
    });
}
async function apiRequest(searchParams) {
    let querryUrl = API_URL + searchParams;
    let response = await node_fetch_1.default(querryUrl, {
        headers: HEADERS,
    });
    let json = await response.json();
    return json;
}
async function requestWithExpBackoff(searchParams) {
    const delayCofficient = 0.0512;
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
