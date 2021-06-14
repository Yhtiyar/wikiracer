"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backtracePath = exports.Agent_L = exports.LogicalAgent = exports.RandomAgent = exports.BfsAgent = void 0;
const wikiPage_1 = require("../wikiPage");
var BfsAgent_1 = require("./BfsAgent");
Object.defineProperty(exports, "BfsAgent", { enumerable: true, get: function () { return BfsAgent_1.BfsAgent; } });
var RandomAgent_1 = require("./RandomAgent");
Object.defineProperty(exports, "RandomAgent", { enumerable: true, get: function () { return RandomAgent_1.RandomAgent; } });
var LogicalAgent_1 = require("./LogicalAgent");
Object.defineProperty(exports, "LogicalAgent", { enumerable: true, get: function () { return LogicalAgent_1.LogicalAgent; } });
var Agent_L_1 = require("./Agent_L");
Object.defineProperty(exports, "Agent_L", { enumerable: true, get: function () { return Agent_L_1.Agent_L; } });
/**
 * Builds path from start url to end url with the given parent-relation map
 *
 * If page Y is linked in page X, X is the Y's parent page
 *
 * @param startPageUrl - page where path should starts
 * @param endPageUrl  - page where path should ends
 * @param parent      - HashMap representing parent page url of the given page url
 */
function backtracePath(startPageUrl, endPageUrl, parent) {
    let path = [endPageUrl];
    while (path[path.length - 1] != startPageUrl) {
        let nodeParent = parent.get(path[path.length - 1]);
        if (!nodeParent)
            throw new Error("Cannot backtrace path");
        path.push(nodeParent.toString());
    }
    return path.reverse().map(title => wikiPage_1.wikiPage.makeUrl(title));
}
exports.backtracePath = backtracePath;
