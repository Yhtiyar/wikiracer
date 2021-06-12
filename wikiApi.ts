import { wikiPage } from "./wikiPage";
import fetch from 'node-fetch'

/**
 * Implements API methods of the Wikipedia
 */
export abstract class WikiApi {

    private static logging : boolean;

    /**
     * Enables logging of the requests' informations if
     * the given parameter is true, othervise, disables
     * @param bool value to set
     */
    static setLogging(bool : boolean) {
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
    static async getAllLinkedPages(title : string) : Promise<wikiPage[]> {
        let  requestParametrs = generateLinkSearchParams(title);
        if (this.logging)
            console.log(`requesting inner links of: ${title}`);

        let response = await requestWithExpBackoff(requestParametrs);

        try {
            let linkedPages = new Array<wikiPage>();
            let pages = response.query.pages;
            for (let p in pages) {
                for (let l of pages[p].links) {
                    linkedPages.push(new wikiPage(l.title));
                }
            }
            if (this.logging)
                console.log(`got inner links of: ${title}`)
            return linkedPages;
        }
        catch (err) {
            if (this.logging)
                console.log(`Can't get inner links of: ${title}, probably page is empty`);
            return [];
        }
    }

    //static async getAllCategories(title : string) : Promise<string[]> {
        
    //}

}


const API_URL = "https://en.wikipedia.org/w/api.php?";

/**
 * User-Agent header, 
 * @see https://www.mediawiki.org/wiki/API:Etiquette#The_User-Agent_header for details
 */
const HEADERS = {
    "Accept"       : "application/json",
    "Content-Type" : "application/json",
    "User-Agent"   : " wikiracer/0.1 (https://yhtiyar.github.io; sahatovyhtyyar@gmail.com) generic-library/0.0"
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

/**
 * Generates url parameters for the API request that
 * represents links of the page.
 * @param title - page title
 */
function generateLinkSearchParams(title : string) {
   return new URLSearchParams({
        origin: "*",
        action: "query",
        format: "json",
        prop:"links",
        pllimit:"500",          //number of links, 500-Max limit.
        plnamespace : "0",      //Articles/Pages, see https://en.wikipedia.org/wiki/Wikipedia:Namespace
        titles: title,
    });
}

/**
 * Makes request to the API with given parameters
 * @param searchParams - parameters of the request
 */
async function apiRequest(searchParams : URLSearchParams) {
    let querryUrl = API_URL + searchParams;
    let response = await fetch(querryUrl, {
        headers : HEADERS,
    });
    let json = await response.json();

    return json;
}

/**
 * Makes request with Exponential backoff
 * @see https://en.wikipedia.org/wiki/Exponential_backoff for details
 * @param searchParams - parameters of the request
 */
async function requestWithExpBackoff(searchParams : URLSearchParams) {
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
            expCofficient ++;
        }
    }
}

