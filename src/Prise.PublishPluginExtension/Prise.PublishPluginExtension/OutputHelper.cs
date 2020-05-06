using System.Linq;
using System.Text;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;

namespace Prise.PublishPluginExtension
{
    internal static class OutputHelper
    {
        internal static void WriteToOutput(ProcessOutput processOutput)
        {
            var builder = new StringBuilder();
            if (processOutput.Messages.Any())
                foreach (var msg in processOutput.Messages)
                    builder.AppendLine(msg);

            if (processOutput.Errors.Any())
                foreach (var error in processOutput.Errors)
                    builder.AppendLine(error);

            ThreadHelper.JoinableTaskFactory.Run(async () =>
            {
                // Get the output window
                var outputWindow = Package.GetGlobalService(typeof(SVsOutputWindow)) as IVsOutputWindow;

                // Ensure that the desired pane is visible
                var paneGuid = Microsoft.VisualStudio.VSConstants.OutputWindowPaneGuid.GeneralPane_guid;
                IVsOutputWindowPane pane;
                outputWindow.CreatePane(paneGuid, "General", 1, 0);
                outputWindow.GetPane(paneGuid, out pane);
                pane.Activate();
                pane.OutputString(builder.ToString());
            });
        }
    }
}
