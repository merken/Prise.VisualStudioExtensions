'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
const fs = require("fs");
const path_1 = require("path");
const projecthelper_1 = require("./projecthelper");
class FileHelper {
    constructor(outputAbstraction) {
        this.outputAbstraction = outputAbstraction;
        this.priseJsonFileTemplate = {
            publishDir: '<path to host application .\\bin\\Debug\\netcoreappx.x\\Plugins>',
            configuration: 'Debug',
            nuspecFile: null,
            includeProjectNameInPublishDir: false
        };
    }
    getPriseNuspecFileTemplate(projectName, targetFramework) {
        return `<?xml version='1.0'?>
<package>
    <metadata>
        <id>${projectName}</id>
        <title>${projectName}</title>
        <version>1.0.0</version>
        <authors>TODO</authors>
        <owners>TODO</owners>
        <description>${projectName}</description>
        <copyright>Copyright ${new Date().getFullYear()}</copyright>
        <tags></tags>
    </metadata>
    <files>
        <file src='${path_1.join('bin', 'Debug', targetFramework, 'publish', '*.*')}' target='${path_1.join('lib', targetFramework)}' />
    </files>
</package>`;
    }
    createPriseJsonFile(absolutePathToCsProj) {
        const pathToCsprojFile = path_1.dirname(absolutePathToCsProj);
        const pathToJsonFile = path_1.join(pathToCsprojFile, 'prise.plugin.json');
        if (fs.existsSync(pathToJsonFile)) {
            this.outputAbstraction.error(`prise.plugin.json already exists at ${pathToJsonFile}`);
            return;
        }
        fs.writeFile(pathToJsonFile, JSON.stringify(this.priseJsonFileTemplate), err => {
            if (err) {
                return this.outputAbstraction.error('Failed to create prise.plugin.json file!');
            }
            this.outputAbstraction.writeOutput(`prise.plugin.json created at ${pathToJsonFile}`);
        });
    }
    createPriseNuspecFile(absolutePathToCsProj) {
        const pathToCsprojFile = path_1.dirname(absolutePathToCsProj);
        const projectName = projecthelper_1.ProjectHelper.getProjectName(absolutePathToCsProj);
        const targetFramework = projecthelper_1.ProjectHelper.getTargetFramework(absolutePathToCsProj);
        const nuspecFile = `${projectName}.nuspec`;
        const pathToNuspecFile = path_1.join(pathToCsprojFile, nuspecFile);
        if (fs.existsSync(pathToNuspecFile)) {
            this.outputAbstraction.error(`${nuspecFile} already exists at ${pathToNuspecFile}`);
            return;
        }
        fs.writeFile(pathToNuspecFile, this.getPriseNuspecFileTemplate(projectName, targetFramework), err => {
            if (err) {
                return this.outputAbstraction.error(`Failed to create ${nuspecFile} file!`);
            }
            this.outputAbstraction.writeOutput(`${nuspecFile} created at ${pathToNuspecFile}`);
        });
    }
}
exports.FileHelper = FileHelper;
//# sourceMappingURL=filehelper.js.map