import { LogicalAgent } from "./LogicalAgent";
import { WikiPage } from "../wikiPage";

export class Agent_C extends LogicalAgent {
    /**
     * Returns 100 minus number of categories in which both 
     * pages are presented.
     * 
     * @param l -  page 1
     * @param r -  page 2
     */
    async familiarityDistance(l: WikiPage, r: WikiPage): Promise<number> {
        let sameCategoryCount = 0;

        let lCategories = await l.getCategories();
        let rCategories = await r.getCategories();

        for (let lc of lCategories) {
            for (let rc of rCategories) {
                sameCategoryCount += (lc == rc) ? 1 : 0;
            }
        }

        return 100 - sameCategoryCount;
    }

}