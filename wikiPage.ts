import {WikiApi} from './wikiApi';

const WIKI_URL = "https://en.wikipedia.org/wiki/";

export class wikiPage {
    private links? : wikiPage[];
    private title : string;
    private url : string;

    constructor (title : string) {
        this.title = title;
        this.url = WIKI_URL + this.getTitle();
    }
    
    getTitle() : string {
        return this.title;
    }
    
    getUrl() : string {
        return this.url;
    }

    async getAllLinkedPages() : Promise<wikiPage[]>{
        if (this.links != undefined)
            return this.links;
        this.links = await WikiApi.getAllLinkedTitles(this.title)
        return this.links;
    }
}

