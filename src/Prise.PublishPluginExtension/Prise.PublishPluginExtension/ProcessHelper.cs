using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading;

namespace Prise.PublishPluginExtension
{
    class ProcessHelper
    {
        private ManualResetEvent m_processExited = new ManualResetEvent(false);
        private List<string> m_regularMessages = new List<string>();
        private List<string> m_errorMessages = new List<string>();
        private Process m_process;
        private readonly string process;
        private readonly string workingDir;
        private readonly string arguments;
        private readonly Action<List<string>, List<string>> exit;

        public ProcessHelper(string process, string workingDir, string arguments, Action<List<string>, List<string>> exit)
        {
            this.process = process;
            this.workingDir = workingDir;
            this.arguments = arguments;
            this.exit = exit;
        }

        public void Run()
        {
            m_process = new Process();
            m_process.EnableRaisingEvents = true;
            m_process.StartInfo.FileName = this.process;
            m_process.StartInfo.WorkingDirectory = this.workingDir;
            m_process.StartInfo.Arguments = this.arguments;
            m_process.StartInfo.UseShellExecute = false;
            m_process.StartInfo.CreateNoWindow = true;

            m_process.Exited += this.ProcessExited;

            m_process.StartInfo.RedirectStandardError = true;
            m_process.StartInfo.RedirectStandardOutput = true;

            m_process.ErrorDataReceived += this.ErrorDataHandler;
            m_process.OutputDataReceived += this.OutputDataHandler;

            m_process.Start();

            m_process.BeginErrorReadLine();
            m_process.BeginOutputReadLine();

            m_processExited.WaitOne();
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

        private void ProcessExited(object sender, EventArgs args)
        {
            // This is where you can add some code to be
            // executed before this program exits.
            m_processExited.Set();
            this.exit(m_regularMessages, m_errorMessages);
        }
    }
}
