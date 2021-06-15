import {WikiApi} from './wikiApi';

const WIKI_URL = "https://en.wikipedia.org/wiki/";
/**
 * Represents the wikipedia page. Implements api methods
 */
export class WikiPage {
    private title : string;
    private links? : WikiPage[];
    private categories? : string[];
    /**
     * Creates new WikiPage
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
     * All WikiPages that are linked in the current WikiPage
     * 
     * @remarks
     * Only one request to the API will be made. Result will be cached in memory
     */
    async getAllLinkedPages(onlyFirst500? : boolean) : Promise<WikiPage[]> {
        if (this.links != undefined)
            return this.links;
        return WikiApi.getAllLinkedPages(this.title, onlyFirst500).then(res => {
            this.links = res;
            return res;
        }) 
    }
    
    async getCategories() : Promise<string[]> {
        if (this.categories != undefined)
            return this.categories;
        return WikiApi.getAllCategories(this.title).then(res => {
            this.categories = res.map(el => el.slice(9));  //Removing "Category:" prefix
            return this.categories;
        })
    }

    /**
     * URL to the wikipedia page
     * @param title -  title of the page
     */
    static makeUrl(title : string) {
        return encodeURI(WIKI_URL + title);
    }

    static parseTitle(url : string) : string {
        url = decodeURI(url);
        url = url.replace(/_/g, " ")
        let splitted = url.split('/wiki/');
        if (splitted.length !== 2)
            throw new Error(`Probably not wiki url : ${url}`);
        return splitted[1];
    }
}

