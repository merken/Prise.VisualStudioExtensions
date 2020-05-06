using System;
using System.ComponentModel.Design;
using System.IO;
using EnvDTE;
using Microsoft.VisualStudio.Shell;

namespace Prise.PublishPluginExtension
{
    /// <summary>
    /// Command handler
    /// </summary>
    internal sealed class CreateNuspecFileCommand
    {
        public const int CommandId = 0x0102;
        private readonly Package _package;
        private readonly DTE _dte;

        private CreateNuspecFileCommand(Package package)
        {
            _package = package ?? throw new ArgumentNullException("package");
            _dte = ServiceProvider.GetService(typeof(DTE)) as DTE;

            if (ServiceProvider.GetService(typeof(IMenuCommandService)) is OleMenuCommandService commandService)
            {
                var menuCommandID = new CommandID(Constants.PublishPluginCommandSet, CommandId);
                var menuItem = new OleMenuCommand(MenuItemCallback, menuCommandID);
                menuItem.BeforeQueryStatus += MenuItem_BeforeQueryStatus;
                commandService.AddCommand(menuItem);
            }
        }

        private void MenuItem_BeforeQueryStatus(object sender, EventArgs e) =>
            ((OleMenuCommand)sender).Enabled = !ProjectHelper.DoesAtLeastOneNuspecFileExist(_dte);

        public static CreateNuspecFileCommand Instance
        {
            get;
            private set;
        }

        private IServiceProvider ServiceProvider
        {
            get
            {
                return this._package;
            }
        }

        public static void Initialize(Package package)
        {
            Instance = new CreateNuspecFileCommand(package);
        }

        private void MenuItemCallback(object sender, EventArgs e) =>
            Execute(ServiceProvider);

        public static void Execute(IServiceProvider serviceProvider)
        {
            Microsoft.VisualStudio.Shell.ThreadHelper.ThrowIfNotOnUIThread();

            var dte = serviceProvider.GetService(typeof(DTE)) as DTE;
            var projectPath = ProjectHelper.GetCurrentProjectPath(dte);
            var projectName = ProjectHelper.GetCurrentProjectName(dte);
            var projectFileName = ProjectHelper.GetCurrentProjectFileName(dte);
            var targetFramework = ProjectHelper.GetTargetFrameworkFromProject(dte);
            var nuspecFileName = $"{projectFileName.Split(new[] { ".csproj" }, StringSplitOptions.RemoveEmptyEntries)[0]}.nuspec";

            File.WriteAllText(Path.Combine(projectPath, nuspecFileName), ExampleNuspecFile(projectName, targetFramework));
        }

        private static string ExampleNuspecFile(string projectName, string targetFramework) =>
$@"<?xml version=""1.0""?>
<package>
    <metadata>
        <id>{projectName}</id>
        <title>{projectName}</title>
        <version>1.0.0</version>
        <authors>TODO</authors>
        <owners>TODO</owners>
        <description>{projectName}</description>
        <copyright>Copyright {DateTime.Now.Year}</copyright>
        <tags></tags>
    </metadata>
    <files>
        <file src=""bin\Debug\{targetFramework}\publish\*.*"" target=""lib\{targetFramework}"" />
    </files>
</package>";
    }
}
