import Layout from '@renderer/Layout';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    openAtLogin: false,
    version: '',
  });

  useEffect(() => {
    window.settingsApi.getSettings().then((value) => {
      setSettings(value);
    });
  }, []);

  function updateSettingValue(key: string, value: any) {
    const newSettings = {
      ...settings,
      [key]: value,
    };

    setSettings((prev) => newSettings);

    window.settingsApi.updateSettings(newSettings);
  }

  return (
    <Layout title="Settings">
      <div>
        <div>
          <input
            name="openAtLogin"
            id="openAtLogin"
            type="checkbox"
            checked={settings.openAtLogin}
            onChange={(e) => updateSettingValue('openAtLogin', e.target.checked)}
          />
          <label
            className="ml-2"
            htmlFor="openAtLogin"
          >
            Open at login
          </label>
        </div>

        <div>
          <div>Version: {settings.version}</div>
        </div>
      </div>
    </Layout>
  );
}
