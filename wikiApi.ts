import { wikiPage } from "./wikiPage";
import fetch from 'node-fetch'
const apiUrl = "https://en.wikipedia.org/w/api.php?";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function generateLinkParams(title : string) {
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
    let querryUrl = apiUrl + searchParams;
    let response = await fetch(querryUrl);
    let json = await response.json();
    
    return json;
}

async function expBackoff(searchParams : URLSearchParams) {
    const delayCofficient = 0.0512;
    let expCofficient = 1;
    while (true) {
        try {
            let k = Math.random() * expCofficient;
            delay(k * delayCofficient);
            let ans = await apiRequest(searchParams);
            return ans;
        }
        catch (err) {
            expCofficient <<= 1;
        }
    }
}

export async function getAllLinkedTitles(title : string) : Promise<wikiPage[]>{
    let  searchParams = generateLinkParams(title);
    console.log(`requesting inner links of: ${title}`);
   
    let json = await expBackoff(searchParams);

    /** Tried this was. still blocks every req after first 6 requests
    try {
        json = await apiRequest(searchParams);
    }
    catch (err) {
        await delay(1100);
        json = await apiRequest(searchParams);
    }**/

    let linkedPages = new Array<wikiPage>();
    let pages = json.query.pages;
    for (let p in pages) {
        for (let l of pages[p].links) {
            linkedPages.push(new wikiPage(l.title));
        }
    }

    return linkedPages;
}
