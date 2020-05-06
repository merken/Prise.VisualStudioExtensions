using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Prise.PublishPluginExtension
{
    internal class ProcessOutput
    {
        public IEnumerable<string> Messages { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }

    internal class ProcessHelper
    {
        private List<string> accumulatedMessages = new List<string>();
        private List<string> accumulatedErrors = new List<string>();
        private readonly string process;
        private readonly string workingDir;
        private readonly string arguments;

        public ProcessHelper(string process, string workingDir, string arguments)
        {
            this.process = process;
            this.workingDir = workingDir;
            this.arguments = arguments;
        }

        public ProcessOutput Run()
        {
            var proc = new Process();
            proc.EnableRaisingEvents = true;
            proc.StartInfo.FileName = this.process;
            proc.StartInfo.WorkingDirectory = this.workingDir;
            proc.StartInfo.Arguments = this.arguments;
            proc.StartInfo.UseShellExecute = false;
            proc.StartInfo.CreateNoWindow = true;

            proc.StartInfo.RedirectStandardError = true;
            proc.StartInfo.RedirectStandardOutput = true;

            proc.ErrorDataReceived += this.ErrorDataHandler;
            proc.OutputDataReceived += this.OutputDataHandler;

            proc.Start();

            proc.BeginErrorReadLine();
            proc.BeginOutputReadLine();

            proc.WaitForExit();

            return new ProcessOutput
            {
                Messages = this.accumulatedMessages,
                Errors = this.accumulatedErrors,
            };
        }

        private void ErrorDataHandler(object sender, DataReceivedEventArgs args)
        {
            var message = args.Data;

            if (!String.IsNullOrEmpty(message) && message.StartsWith("Error"))
            {
                // The vsinstr.exe process reported an error
                accumulatedErrors.Add(message);
            }
        }

        private void OutputDataHandler(object sender, DataReceivedEventArgs args) => accumulatedMessages.Add(args.Data);
    }
}
