'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectHelper = void 0;
const fs = require("fs");
const path_1 = require("path");
class ProjectHelper {
    static getTargetFramework(absolutePathToCsProj) {
        const projectFileContents = fs.readFileSync(absolutePathToCsProj, 'utf8');
        var targetFrameworkRegex = new RegExp('<TargetFramework>(.*?)</TargetFramework>', 'gmi');
        var targetFrameworkRegexResults = targetFrameworkRegex.exec(projectFileContents);
        if (!targetFrameworkRegexResults) {
            throw new Error(`${projectFileContents} could not be parsed`);
        }
        return targetFrameworkRegexResults[1];
    }
    static getProjectName(absolutePathToCsProj) {
        return path_1.basename(absolutePathToCsProj, '.csproj');
    }
}
exports.ProjectHelper = ProjectHelper;
//# sourceMappingURL=projecthelper.js.map