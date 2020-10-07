"use strict";
import * as fs from "fs";
import { dirname, join } from "path";
import { ProjectHelper } from "./projecthelper";
import { OutputAbstraction } from "./abstractions/output.abstraction";
import { IContextAbstraction } from "./abstractions/context.abstraction";

export class FileHelper {
  constructor(
    private outputAbstraction: OutputAbstraction,
    private contextAbstraction: IContextAbstraction
  ) {}

  private priseJsonFileTemplate: any = {
    publishDir:
      "<path to host application .\\bin\\Debug\\netcoreappx.x\\Plugins>",
    configuration: "Debug",
    nuspecFile: null,
    includeProjectNameInPublishDir: false,
  };

  private getPriseNuspecFileTemplate(
    projectName: string,
    targetFramework: string
  ): string {
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
        <file src='${join(
          "bin",
          "Debug",
          targetFramework,
          "publish",
          "*.*"
        )}' target='${join("lib", targetFramework)}' />
    </files>
</package>`;
  }

  public createPriseJsonFile(absolutePathToCsProj: string): void {
    const pathToCsprojFile = dirname(absolutePathToCsProj);
    const pathToJsonFile = join(pathToCsprojFile, "prise.plugin.json");
    if (fs.existsSync(pathToJsonFile)) {
      this.outputAbstraction.error(
        `prise.plugin.json already exists at ${pathToJsonFile}`
      );
      return;
    }

    fs.writeFile(
      pathToJsonFile,
      JSON.stringify(this.priseJsonFileTemplate, null, "\t"),
      (err) => {
        if (err) {
          return this.outputAbstraction.error(
            "Failed to create prise.plugin.json file!"
          );
        }
        this.outputAbstraction.writeOutput(
          `prise.plugin.json created at ${pathToJsonFile}`
        );
      }
    );
    this.contextAbstraction.pluginFileCreated();
  }

  public createPriseNuspecFile(absolutePathToCsProj: string): void {
    const pathToCsprojFile = dirname(absolutePathToCsProj);
    const projectName = ProjectHelper.getProjectName(absolutePathToCsProj);
    const targetFramework = ProjectHelper.getTargetFramework(
      absolutePathToCsProj
    );
    const nuspecFile = `${projectName}.nuspec`;
    const pathToNuspecFile = join(pathToCsprojFile, nuspecFile);
    if (fs.existsSync(pathToNuspecFile)) {
      this.outputAbstraction.error(
        `${nuspecFile} already exists at ${pathToNuspecFile}`
      );
      return;
    }

    fs.writeFile(
      pathToNuspecFile,
      this.getPriseNuspecFileTemplate(projectName, targetFramework),
      (err) => {
        if (err) {
          return this.outputAbstraction.error(
            `Failed to create ${nuspecFile} file!`
          );
        }

        this.outputAbstraction.writeOutput(
          `${nuspecFile} created at ${pathToNuspecFile}`
        );
      }
    );
    this.contextAbstraction.nuspecFileCreated();
  }
}
