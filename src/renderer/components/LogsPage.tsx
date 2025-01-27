import Layout from '@renderer/Layout';
import Container from './ui/Container';
import AppButton from './ui/AppButton';
import { useEffect, useState } from 'react';

export function LogsPage() {
  function openLogFile() {
    window.logsApi.openLogFile();
  }

  const [logs, setLogs] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    const listener = window.logsApi.onLog(
      (event: Electron.IpcRendererEvent, message: Record<string, any>) => {
        console.log('handleLog', event, message);
        setLogs((prevLogs) => [message, ...prevLogs]);
      },
    );

    return () => {
      listener();
    };
  }, []);

  return (
    <Layout
      title="Logs"
      actions={<AppButton onClick={openLogFile}>Open log file</AppButton>}
    >
      <Container className="">
        <ul className="divide-y">
          {logs.map((log, index) => (
            <li key={index}>{JSON.stringify(log)}</li>
          ))}
        </ul>
      </Container>
    </Layout>
  );
}
