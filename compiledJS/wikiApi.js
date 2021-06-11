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
        let requestParametrs = generateSearchParams(title);
        if (this.logging)
            console.log(`requesting inner links of: ${title}`);
        let response = await expBackoffRequest(requestParametrs);
        try {
            let linkedPages = new Array();
            let pages = response.query.pages;
            for (let p in pages) {
                for (let l of pages[p].links) {
                    linkedPages.push(new wikiPage_1.wikiPage(l.title));
                }
            }
            return linkedPages;
        }
        catch (err) {
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
function generateSearchParams(title) {
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
async function expBackoffRequest(searchParams) {
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
