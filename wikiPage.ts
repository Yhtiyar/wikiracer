import {WikiApi} from './wikiApi';

const WIKI_URL = "https://en.wikipedia.org/wiki/";
/**
 * Represents the wikipedia page.
 */
export class wikiPage {
    private links? : wikiPage[];
    private title : string;

    /**
     * Creates new wikiPage
     * @param title - title of the wikipedia page
     */
    constructor (title : string) {
        this.title = title;
    }
    
    /**
     * Title of the wikipedia page
     */
    getTitle() : string {
        return this.title;
    }
    
    /**
     * All wikiPages that are linked in the current wikiPage
     * 
     * @remarks
     * Only one request to the API will be made. Result will be cached in memory
     */
    async getAllLinkedPages(onlyFirst500? : boolean) : Promise<wikiPage[]>{
        if (this.links != undefined)
            return this.links;
        return WikiApi.getAllLinkedPages(this.title, onlyFirst500).then(res => {
            this.links = res;
            return res;
        }) 
    }
    
    /**
     * URL to the wikipedia page
     * @param title -  title of the page
     */
    static makeUrl(title : string) {
        return encodeURI(WIKI_URL + title);
    }
}

