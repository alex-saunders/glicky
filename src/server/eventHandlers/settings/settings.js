// @flow
import fs from 'fs';
import path from 'path';
import ospath from 'ospath';

import { type Settings } from '../../../types';

const defaultSettings: Settings = {
  dark: true,
  primaryColour: '#2196f3',
  dependenciesCheckOnStartup: true,
  filterOutdatedDependencies: false
};

class SettingsEventsHandler {
  settings: Settings = this.fetchSettings();

  getProjectDataDirectory() {
    const dataPath = ospath.data();
    const projectDataPath = path.join(dataPath, 'Glicky');

    if (!fs.existsSync(projectDataPath)) {
      fs.mkdirSync(projectDataPath);
    }

    return projectDataPath;
  }

  getSettingsPath() {
    const dataPath = this.getProjectDataDirectory();
    return path.join(dataPath, 'settings.json');
  }

  fetchSettings() {
    const settingsPath = this.getSettingsPath();

    let settings = defaultSettings;
    if (fs.existsSync(settingsPath)) {
      const file = fs.readFileSync(settingsPath, 'utf8');
      settings = file ? JSON.parse(file) : settings;
    }

    return settings;
  }

  getSettings = () => {
    return new Promise<Settings>(resolve => {
      resolve(this.settings);
    });
  };

  setSettings = ({ settings }: { settings: Settings }) => {
    return new Promise<Settings>(resolve => {
      this.settings = Object.assign({}, this.settings, settings);
      fs.writeFileSync(
        this.getSettingsPath(),
        JSON.stringify(this.settings),
        'utf8'
      );
      resolve(this.settings);
    });
  };
}

const instance = new SettingsEventsHandler();
export default instance;
