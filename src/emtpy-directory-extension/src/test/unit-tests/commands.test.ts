import assert = require("assert");
import TypeMoq = require("typemoq");
import { IDialogAbstraction } from "../../abstractions/dialog.abstraction";
import { IFileSystemAbstraction } from "../../abstractions/filesystem.abstraction";
import { EmptyCommand } from "../../commands/empty.command";

describe("EmptyCommand", function () {
  describe("execute", function () {
    // it("should do nothing when invalid args are provided", function () {
    //   const dialogAbstraction = TypeMoq.Mock.ofType<IDialogAbstraction>();
    //   const fileSystemAbstraction = TypeMoq.Mock.ofType<
    //     IFileSystemAbstraction
    //   >();

    //   assert(fileSystemAbstraction.object !== undefined);

    //   new EmptyCommand(
    //     dialogAbstraction.object,
    //     fileSystemAbstraction.object
    //   ).execute(null);

    //   dialogAbstraction.verify(
    //     (f) => f.confirm(TypeMoq.It.isAnyString()),
    //     TypeMoq.Times.never()
    //   );
    //   fileSystemAbstraction.verify(
    //     (f) => f.emptyDirectory(TypeMoq.It.isAnyString()),
    //     TypeMoq.Times.never()
    //   );
    // });

    it("should empty the directory when dialog returns true", function () {
      const dialogAbstraction = TypeMoq.Mock.ofType<IDialogAbstraction>();
      const fileSystemAbstraction: TypeMoq.IMock<IFileSystemAbstraction> = TypeMoq.Mock.ofType<IFileSystemAbstraction>();
      const testPath = "testpath";

      dialogAbstraction
        .setup((f) => f.confirm(TypeMoq.It.isAnyString()))
        .returns(async () => true);

      fileSystemAbstraction
        .setup((f) => f.emptyDirectory(testPath))
        .returns(() => true);

      new EmptyCommand(
        dialogAbstraction.object,
        fileSystemAbstraction.object
      ).execute({ fsPath: testPath });

      fileSystemAbstraction.verify(
        (f) => f.emptyDirectory(TypeMoq.It.isValue(testPath)),
        TypeMoq.Times.once()
      );
    });

    // it("should empty the directory when dialog returns false", function () {
    //   const dialogAbstraction = TypeMoq.Mock.ofType<IDialogAbstraction>();
    //   const fileSystemAbstraction = TypeMoq.Mock.ofType<
    //     IFileSystemAbstraction
    //   >();

    //   dialogAbstraction
    //     .setup((f) => f.confirm(TypeMoq.It.isAnyString()))
    //     .returns(
    //       () => new Promise<boolean>((r) => r(false))
    //     );

    //   new EmptyCommand(
    //     dialogAbstraction.object,
    //     fileSystemAbstraction.object
    //   ).execute({ fsPath: "testpath" });

    //   fileSystemAbstraction.verify(
    //     (f) => f.emptyDirectory("testpath"),
    //     TypeMoq.Times.never()
    //   );
    // });
  });
});
