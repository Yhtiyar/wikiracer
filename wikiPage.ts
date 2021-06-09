import {getAllLinkedTitles} from './wikiApi';

const wikiUrl = "https://en.wikipedia.org/wiki/";

export class wikiPage {
    private links? : Array<wikiPage>;
    private title : string;
    constructor (title : string) {
        this.title = title;
    }
    
    getTitle() : string {
        return this.title;
    }
    
    getUrl() : string {
        return wikiUrl + this.getTitle();
    }

    async getAllLinkedPages() : Promise<Array<wikiPage>>{
        if (this.links)
            return this.links;
        this.links = await getAllLinkedTitles(this.title)
        return this.links;
    }
}

