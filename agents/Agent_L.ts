import {LogicalAgent} from './Agents';
import { WikiPage } from '../wikiPage';


export class Agent_L extends LogicalAgent {
    /**
     * Levenshtein distance, make strings same with minimal cost with insertig,
     * replacing, deleting charachters in both strings.
     * 
     * @remark
     * These are magic numbers I discovered by testing
     * 
     * @see https://en.wikipedia.org/wiki/Levenshtein_distance
     * 
     * @see http://neerc.ifmo.ru/wiki/index.php?title=%D0%97%D0%B0%D0%B4%D0%B0%D1%87%D0%B0_%D0%BE_%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D0%BE%D0%BC_%D1%80%D0%B0%D1%81%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B8,_%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%92%D0%B0%D0%B3%D0%BD%D0%B5%D1%80%D0%B0-%D0%A4%D0%B8%D1%88%D0%B5%D1%80%D0%B0
     * @param a - string 1
     * @param b - string 2
     */
    private levenshteinDistance(a : string, b : string) {
        const dp = Array.from({ length: a.length })
                            .map(() => Array.from({ length: b.length })
                                            .map(() => 0))
        const DELETE_COST = 2;
        const INSERT_COST = 2;
        const REPLACE_COST = 50;

        for (let j = 0; j < b.length; j++) {
            dp[0][j] = INSERT_COST * j;
            for (let i = 0; i < a.length; i++) {
                dp[i][0] = DELETE_COST * i;
                dp[i][j] = Math.min(
                    (i == 0 ? 0 : dp[i - 1][j]) + DELETE_COST,
                    (j == 0 ? 0 : dp[i][j - 1]) + INSERT_COST,
                    (i == 0 || j == 0 ? 0 : dp[i - 1][j - 1]) + (a[i] == b[j] ? 0 : REPLACE_COST)
                )
            }
        }
        return dp[a.length - 1][b.length - 1];
    }

    public async familiarityDistance(l: WikiPage, r: WikiPage): Promise<number> {
        let distanceSum = 10;
        let lCategories = await l.getCategories();
        let rCategories = await r.getCategories();
        for (let lc of lCategories) {
            for (let rc of rCategories) {
                distanceSum += this.levenshteinDistance(lc, rc);
            }
        }

        let titleDistance = this.levenshteinDistance(l.getTitle(), r.getTitle());
        if (lCategories.length == 0 || rCategories.length == 0)
            return titleDistance;

        return distanceSum / (lCategories.length * rCategories.length);
    }
}