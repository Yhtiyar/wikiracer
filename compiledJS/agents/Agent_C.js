"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent_C = void 0;
const LogicalAgent_1 = require("./LogicalAgent");
class Agent_C extends LogicalAgent_1.LogicalAgent {
    async familiarityDistance(l, r) {
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
exports.Agent_C = Agent_C;
