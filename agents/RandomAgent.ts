import {Agent} from './Agents';
import {WikiPage} from '../wikiPage';
import {WikiApi} from '../wikiApi';


export class RandomAgent implements Agent {
    private fastMode = true;
    turnOffFastMode(): void {
        this.fastMode = false;
    }
    
    private getRandomPage(pages : WikiPage[]) {
        return pages[Math.floor(Math.random() * pages.length)];
    }

    run = async (startPage: WikiPage, endPage: WikiPage): Promise<string[]> => {
        let path = [startPage.getTitle()];

        while(true) {
            let linkedPages = await startPage.getAllLinkedPages(this.fastMode);
            for (let page of linkedPages) {
                if (page.getTitle() == endPage.getTitle()) {
                    path.push(page.getTitle());
                    return path.map(title => WikiPage.makeUrl(title));
                }
            }
            startPage = this.getRandomPage(linkedPages);
            path.push(startPage.getTitle());
        }
    }
}