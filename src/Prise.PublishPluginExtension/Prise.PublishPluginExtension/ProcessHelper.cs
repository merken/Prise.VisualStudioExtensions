using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading;

namespace Prise.PublishPluginExtension
{
    internal class ProcessOutput
    {
        public IEnumerable<string> Messages { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }

    internal class ProcessHelper
    {
        private List<string> m_regularMessages = new List<string>();
        private List<string> m_errorMessages = new List<string>();
        private Process m_process;
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
            m_process = new Process();
            m_process.EnableRaisingEvents = true;
            m_process.StartInfo.FileName = this.process;
            m_process.StartInfo.WorkingDirectory = this.workingDir;
            m_process.StartInfo.Arguments = this.arguments;
            m_process.StartInfo.UseShellExecute = false;
            m_process.StartInfo.CreateNoWindow = true;
            
            m_process.StartInfo.RedirectStandardError = true;
            m_process.StartInfo.RedirectStandardOutput = true;

            m_process.ErrorDataReceived += this.ErrorDataHandler;
            m_process.OutputDataReceived += this.OutputDataHandler;

            m_process.Start();

            m_process.BeginErrorReadLine();
            m_process.BeginOutputReadLine();

            m_process.WaitForExit();

            return new ProcessOutput
            {
                Messages = this.m_regularMessages,
                Errors = this.m_errorMessages,
            };
        }

        private void ErrorDataHandler(object sender, DataReceivedEventArgs args)
        {
            string message = args.Data;

            if (!String.IsNullOrEmpty(message) && message.StartsWith("Error"))
            {
                // The vsinstr.exe process reported an error
                m_errorMessages.Add(message);
            }
        }

        private void OutputDataHandler(object sender, DataReceivedEventArgs args)
        {
            string message = args.Data;

            m_regularMessages.Add(message);
        }
    }
}
