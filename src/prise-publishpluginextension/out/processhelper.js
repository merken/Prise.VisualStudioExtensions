'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessHelper = void 0;
const fs = require("fs");
const path_1 = require("path");
const cp = require("child_process");
const projecthelper_1 = require("./projecthelper");
class ProcessHelper {
    constructor(outputAbstraction) {
        this.outputAbstraction = outputAbstraction;
    }
    getPrisePluginConfig(absolutePathToCsProj) {
        const priseConfigFilePath = path_1.join(path_1.dirname(absolutePathToCsProj), 'prise.plugin.json');
        if (!fs.existsSync(priseConfigFilePath)) {
            this.outputAbstraction.error(`prise.plugin.json does not exists at ${priseConfigFilePath}`);
            return;
        }
        const priseConfigContents = fs.readFileSync(priseConfigFilePath, 'utf8');
        return JSON.parse(priseConfigContents);
    }
    publishPlugin(absolutePathToCsProj) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.getPrisePluginConfig(absolutePathToCsProj);
            if (!config) {
                return;
            }
            const workingDir = path_1.dirname(absolutePathToCsProj);
            const projectName = projecthelper_1.ProjectHelper.getProjectName(absolutePathToCsProj);
            const targetFramework = projecthelper_1.ProjectHelper.getTargetFramework(absolutePathToCsProj);
            const configuration = (_a = config.configuration) !== null && _a !== void 0 ? _a : 'Debug';
            let publishPath = config.publishDir;
            if (!path_1.isAbsolute(publishPath)) {
                publishPath = path_1.resolve(workingDir, publishPath);
            }
            if (config.includeProjectNameInPublishDir) {
                publishPath = path_1.join(publishPath, projectName);
            }
            if (!fs.existsSync(publishPath)) {
                this.outputAbstraction.error(`Publish dir does not exists: ${publishPath}`);
                return;
            }
            yield this.dotnet('publish', projectName, targetFramework, workingDir, configuration, `${projectName}.csproj`, publishPath);
        });
    }
    packPlugin(absolutePathToCsProj) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.getPrisePluginConfig(absolutePathToCsProj);
            if (!config) {
                return;
            }
            const workingDir = path_1.dirname(absolutePathToCsProj);
            const projectName = projecthelper_1.ProjectHelper.getProjectName(absolutePathToCsProj);
            const targetFramework = projecthelper_1.ProjectHelper.getTargetFramework(absolutePathToCsProj);
            const configuration = (_a = config.configuration) !== null && _a !== void 0 ? _a : 'Debug';
            let nuspecFile = (_b = config.nuspecFile) !== null && _b !== void 0 ? _b : `${projectName.split('.csproj')[0]}.nuspec`;
            let publishPath = config.publishDir;
            if (!path_1.isAbsolute(publishPath)) {
                publishPath = path_1.resolve(workingDir, publishPath);
            }
            if (!path_1.isAbsolute(nuspecFile)) {
                nuspecFile = path_1.resolve(workingDir, nuspecFile);
            }
            if (!fs.existsSync(publishPath)) {
                this.outputAbstraction.error(`Publish dir does not exists: ${publishPath}`);
                return;
            }
            if (!fs.existsSync(nuspecFile)) {
                this.outputAbstraction.error(`NuSpec file does not exists: ${nuspecFile}`);
                return;
            }
            const outputDir = yield this.dotnet('publish', projectName, targetFramework, workingDir, configuration, `${projectName}.csproj`);
            this.changeLastWriteTime(path_1.resolve(workingDir, outputDir));
            yield this.dotnet('pack', projectName, targetFramework, workingDir, configuration, `${projectName}.csproj`, publishPath);
        });
    }
    changeLastWriteTime(outputDir) {
        var files = fs.readdirSync(outputDir);
        const searchTime = new Date(2000, 1, 1);
        for (var i = 0; i < files.length; i++) {
            var filename = path_1.join(outputDir, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                this.changeLastWriteTime(filename); //recurse
            }
            else if (filename.indexOf('.dll') >= 0) {
                var stats = fs.statSync(filename);
                var mtime = stats.mtime;
                if (mtime < searchTime) {
                    mtime.setFullYear(mtime.getFullYear() + 20);
                    fs.utimesSync(filename, mtime, mtime);
                }
            }
            ;
        }
        ;
    }
    dotnet(command, projectName, targetFramework, workingDir, configuration, projectFile, outputPath) {
        return new Promise(resolve => {
            let options = { cwd: workingDir };
            let args = [command, '--configuration', configuration, projectFile];
            if (outputPath) {
                args = [...args, '--output', outputPath];
            }
            let childProcess = cp.spawn(`dotnet`, args, options);
            if (childProcess.pid) {
                childProcess.stdout.on('data', (data) => {
                    this.outputAbstraction.writeOutput(data.toString());
                });
                childProcess.stdout.on('end', () => {
                    const output = outputPath !== null && outputPath !== void 0 ? outputPath : path_1.join('bin', configuration, targetFramework, 'publish');
                    this.outputAbstraction.writeOutput(`Published ${projectName} to ${output}`);
                    resolve(output);
                });
            }
        });
    }
}
exports.ProcessHelper = ProcessHelper;
//# sourceMappingURL=processhelper.js.map