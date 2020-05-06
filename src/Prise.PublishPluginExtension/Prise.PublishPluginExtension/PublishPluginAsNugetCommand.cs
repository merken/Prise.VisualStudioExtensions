using System;
using System.ComponentModel.Design;
using System.IO;
using EnvDTE;
using Microsoft.VisualStudio.Shell;

namespace Prise.PublishPluginExtension
{
    internal sealed class PublishPluginAsNugetCommand
    {
        public const int CommandId = 0x0103;
        private readonly Package _package;
        private readonly DTE _dte;

        private PublishPluginAsNugetCommand(Package package)
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
            ((OleMenuCommand)sender).Enabled = ProjectHelper.DoesAtLeastOneNuspecFileExist(_dte);

        public static PublishPluginAsNugetCommand Instance
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
            Instance = new PublishPluginAsNugetCommand(package);
        }

        private void MenuItemCallback(object sender, EventArgs e) =>
            Execute(ServiceProvider);

        public static void Execute(IServiceProvider serviceProvider)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            var dte = serviceProvider.GetService(typeof(DTE)) as DTE;
            var options = ProjectHelper.GetPrisePluginFileFromSelectedProject(dte);

            var projectPath = ProjectHelper.GetCurrentProjectPath(dte);
            var projectName = ProjectHelper.GetCurrentProjectName(dte);
            var projectFileName = ProjectHelper.GetCurrentProjectFileName(dte);
            var targetFramework = ProjectHelper.GetTargetFrameworkFromProject(dte);
            var nuspecFile = $"{projectFileName.Split(new[] { ".csproj" }, StringSplitOptions.RemoveEmptyEntries)[0]}.nuspec";
            var publishPath = Path.IsPathRooted(options.PublishDir) ? options.PublishDir : Path.GetFullPath(Path.Combine(projectPath, options.PublishDir));
            var configuration = !String.IsNullOrEmpty(options.Configuration) ? options.Configuration : "Debug";

            if (options.IncludeProjectNameInPublishDir)
                publishPath = Path.Combine(publishPath, projectName);

            if (!String.IsNullOrEmpty(options.NuspecFile))
                nuspecFile = Path.IsPathRooted(options.NuspecFile) ? options.NuspecFile : Path.GetFullPath(Path.Combine(projectPath, options.NuspecFile));

            if (!Directory.Exists(publishPath))
                throw new NotSupportedException($"Path '{publishPath}' does not exist, please create or update path.");

            var publishOutput = DotnetCliHelper.Publish(projectPath, configuration, projectFileName);
            OutputHelper.WriteToOutput(publishOutput);

            var timestampFixOutput = PowershellHelper.FixUpdateLastWriteTime(projectPath, configuration, targetFramework);
            OutputHelper.WriteToOutput(timestampFixOutput);

            var packOutput = DotnetCliHelper.Pack(projectPath, configuration, projectFileName, publishPath, nuspecFile);
            OutputHelper.WriteToOutput(packOutput);
        }
    }
}
