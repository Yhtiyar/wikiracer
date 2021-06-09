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

export async function getAllLinkedTitles(title : string) : Promise<wikiPage[]>{
    let  searchParams = generateLinkParams(title);
    console.log(`requesting: ${title} inner links`);
    let json;
    try {
        json = await apiRequest(searchParams);
    }
    catch (err) {
        await delay(1100);
        json = await apiRequest(searchParams);
    }

    let linkedPages = new Array<wikiPage>();
    let pages = json.query.pages;
    for (let p in pages) {
        for (let l of pages[p].links) {
            linkedPages.push(new wikiPage(l.title));
        }
    }

    return linkedPages;
}
