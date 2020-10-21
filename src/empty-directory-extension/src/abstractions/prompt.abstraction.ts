import { window } from "vscode";

export interface IPromptAbstraction {
  showMessage(message: string): void;
}

//This abstracts away FS dependency
export class PromptAbstraction implements IPromptAbstraction {
  showMessage(message: string): void {
    window.showInformationMessage(message);
  }
}
