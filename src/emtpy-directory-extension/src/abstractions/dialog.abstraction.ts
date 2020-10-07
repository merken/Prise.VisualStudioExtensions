import { QuickInputButton, ThemeIcon, window } from "vscode";

export interface IDialogAbstraction {
  confirm(question: string): Promise<boolean>;
}

//This abstracts away FS dependency
export class DialogAbstraction implements IDialogAbstraction {
  confirm(question: string): Promise<boolean> {
    const confirmButton: QuickInputButton = {
      iconPath: new ThemeIcon("check"),
    };
    const cancelButton: QuickInputButton = {
      iconPath: new ThemeIcon("chrome-close"),
    };
    const dialog = window.createQuickPick();
    dialog.buttons = [confirmButton, cancelButton];
    dialog.title = question;
    dialog.placeholder = "Type 'yes' to confirm or select the checkmark above.";
    dialog.show();

    return new Promise<boolean>((resolve, reject) => {
      dialog.onDidChangeValue((s) => {
        if (s.toLowerCase() === "yes") {
          resolve(true);
          dialog.hide();
        }
      });

      dialog.onDidChangeSelection(([{ label }]) => {
        debugger;
        window.showInformationMessage(label);
        dialog.hide();
      });

      dialog.onDidTriggerButton((btn) => {
        if (btn === confirmButton) {
          resolve(true);
        }
        if (btn === cancelButton) {
          resolve(false);
        }
        dialog.hide();
      });
    });
  }
}
