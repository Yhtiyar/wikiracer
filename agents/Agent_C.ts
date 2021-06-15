import { LogicalAgent } from "./LogicalAgent";
import { wikiPage } from "../wikiPage";

export class Agent_C extends LogicalAgent {

    async familiarityDistance(l: wikiPage, r: wikiPage): Promise<number> {
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