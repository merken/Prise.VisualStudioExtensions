import * as fs from "fs";
import Path = require("path");

export interface IFileSystemAbstraction {
  emptyDirectory(dir: string): boolean;
  emptyFiles(dir: string): boolean;
}

//This abstracts away FS dependency
export class FileSystemAbstraction implements IFileSystemAbstraction {
  emptyDirectory(dir: string): boolean {
    this.deleteDirectoryRecursive(dir, false, false);
    return true;
  }

  emptyFiles(dir: string): boolean {
    this.deleteDirectoryRecursive(dir, false, true);
    return true;
  }

  private deleteDirectoryRecursive(path: string, deleteTopLevelDir: boolean, keepDirectoryStructure: boolean) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = Path.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          this.deleteDirectoryRecursive(curPath, true, keepDirectoryStructure);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      if (!keepDirectoryStructure && deleteTopLevelDir) {
        // delete directory
        fs.rmdirSync(path);
      }
    }
  }
}
