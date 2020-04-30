using System;
using System.ComponentModel.Design;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using EnvDTE;
using Microsoft.VisualStudio;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;

namespace Prise.PublishPluginExtension
{
    /// <summary>
    /// Command handler
    /// </summary>
    internal sealed class PublishPluginCommand
    {
        public const int CommandId = 0x0101;
        private readonly Package _package;
        private readonly DTE _dte;

        private PublishPluginCommand(Package package)
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
            ((OleMenuCommand)sender).Enabled = ProjectHelper.DoesPrisePluginFileExist(_dte);

        public static PublishPluginCommand Instance
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
            Instance = new PublishPluginCommand(package);
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
            var publishPath = Path.GetFullPath(Path.Combine(projectPath, options.PublishDir));
            var configuration = !String.IsNullOrEmpty(options.Configuration) ? options.Configuration : "Debug";

            if (options.IncludeProjectNameInPublishDir)
                publishPath = Path.Combine(publishPath, projectName);

            if (!Directory.Exists(publishPath))
                throw new NotSupportedException($"Path '{publishPath}' does not exist, please create or update path.");

            StartPublishProcessAndWriteOutput(projectPath, configuration, publishPath);
        }

        private static void StartPublishProcessAndWriteOutput(string workingDir, string configuration, string outputPath)
        {
            new ProcessHelper(
                "cmd.exe",
                workingDir,
                $@"/k ""dotnet publish --configuration {configuration} --output {outputPath}"" && exit",
                (messages, errors) =>
                {
                    var builder = new StringBuilder();
                    if (messages.Any())
                    {
                        foreach (var msg in messages)
                            builder.AppendLine(msg);
                    }
                    if (messages.Any())
                    {
                        foreach (var error in errors)
                            builder.AppendLine(error);
                    }
                    WriteToOutput(builder.ToString());
                }
            );
        }

        private static void WriteToOutput(string text)
        {
            ThreadHelper.ThrowIfNotOnUIThread();
            // Get the output window
            var outputWindow = Package.GetGlobalService(typeof(SVsOutputWindow)) as IVsOutputWindow;

            // Ensure that the desired pane is visible
            var paneGuid = Microsoft.VisualStudio.VSConstants.OutputWindowPaneGuid.GeneralPane_guid;
            IVsOutputWindowPane pane;
            outputWindow.CreatePane(paneGuid, "General", 1, 0);
            outputWindow.GetPane(paneGuid, out pane);
            pane.Activate();
            pane.OutputString(text);
        }
    }
}
