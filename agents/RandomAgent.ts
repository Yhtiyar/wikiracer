import {Agent} from './Agents';
import {wikiPage} from '../wikiPage';
import {WikiApi} from '../wikiApi';


export class RandomAgent implements Agent {
    
    private getRandomPage(pages : wikiPage[]) {
        return pages[Math.floor(Math.random() * pages.length)];
    }

    run = async (startPage: wikiPage, endPage: wikiPage): Promise<string[]> => {
        let path = [startPage.getTitle()];

        while(true) {
            let linkedPages = await startPage.getAllLinkedPages();
            for (let page of linkedPages) {
                if (page.getTitle() == endPage.getTitle()) {
                    path.push(page.getTitle());
                    return path.map(title => wikiPage.makeUrl(title));
                }
            }
            startPage = this.getRandomPage(linkedPages);
            path.push(startPage.getTitle());
        }
    }
}