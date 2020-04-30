using System;
using System.ComponentModel.Design;
using System.Diagnostics;
using System.IO;
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

            var process = new System.Diagnostics.Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    WorkingDirectory = projectPath,
                    Arguments = $@"/k ""dotnet publish --configuration {configuration} --output {publishPath}"" && exit",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                }
            };

            var publishOutput = StartPublishProcessAndGetOutput(projectPath, configuration, publishPath);
            WriteToOutput(publishOutput);
        }

        private static string StartPublishProcessAndGetOutput(string workingDir, string configuration, string outputPath)
        {
            var process = new System.Diagnostics.Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    WorkingDirectory = workingDir,
                    Arguments = $@"/k ""dotnet publish --configuration {configuration} --output {outputPath}"" && exit",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                }
            };
            process.Start();
            process.WaitForExit();
            return process.StandardOutput.ReadToEnd();
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
