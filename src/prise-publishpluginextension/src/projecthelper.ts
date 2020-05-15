'use strict';
import * as fs from 'fs';
import { basename } from 'path';

export class ProjectHelper {
    public static getTargetFramework(absolutePathToCsProj: string): string {
        const projectFileContents = fs.readFileSync(absolutePathToCsProj, 'utf8');
        var targetFrameworkRegex = new RegExp('<TargetFramework>(.*?)</TargetFramework>', 'gmi');
        var targetFrameworkRegexResults = targetFrameworkRegex.exec(projectFileContents);
        if (!targetFrameworkRegexResults) { throw new Error(`${projectFileContents} could not be parsed`); }

        return targetFrameworkRegexResults[1];
    }

    public static getProjectName(absolutePathToCsProj: string): string {
        return basename(absolutePathToCsProj, '.csproj');
    }
}