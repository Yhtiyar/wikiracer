import { wikiPage } from "./wikiPage";
import fetch from 'node-fetch'


export abstract class WikiApi {
    private static logging : boolean;

    static setLogging(bool : boolean) {
        this.logging = bool;
    }

    static async getAllLinkedTitles(title : string) : Promise<wikiPage[]> {
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
            console.log(`got inner links of: ${title}`)
            return linkedPages;
        }
        catch (err) {
            if (this.logging)
                console.log(`Can't get inner links of: ${title}`);
            return [];
        }
    }

    //static async getAllCategories(title : string) : Promise<string[]> {
        
    //}

}


const API_URL = "https://en.wikipedia.org/w/api.php?";

const HEADERS = {
    "Accept"       : "application/json",
    "Content-Type" : "application/json",
    "User-Agent"   : " wikiracer/0.1 (https://yhtiyar.github.io; sahatovyhtyyar@gmail.com) generic-library/0.0"
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function generateLinkSearchParams(title : string) {
   return new URLSearchParams({
        origin: "*",
        action: "query",
        format: "json",
        prop:"links",
        pllimit:"500",
        plnamespace : "0",
        titles: title,
    });
}

async function apiRequest(searchParams : URLSearchParams) {
    let querryUrl = API_URL + searchParams;
    let response = await fetch(querryUrl, {
        headers : HEADERS,
    });
    let json = await response.json();

    return json;
}

async function requestWithExpBackoff(searchParams : URLSearchParams) {
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
            expCofficient ++;
        }
    }
}

