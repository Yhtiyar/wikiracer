import {WikiApi} from './wikiApi';

const WIKI_URL = "https://en.wikipedia.org/wiki/";

export class wikiPage {
    private links? : wikiPage[];
    private title : string;

    constructor (title : string) {
        this.title = title;
    }
    
    getTitle() : string {
        return this.title;
    }
    
    async getAllLinkedPages() : Promise<wikiPage[]>{
        if (this.links != undefined)
            return this.links;
        return WikiApi.getAllLinkedTitles(this.title).then(res => {
            this.links = res;
            return res;
        })
    }
    
    static makeUrl(title : string) {
        return encodeURI(WIKI_URL + title);
    }
}

