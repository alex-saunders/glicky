// @flow
import fs from 'fs';
import path from 'path';
import ospath from 'ospath';

import { type Settings } from '../../types';

const defaultSettings: Settings = {
  dark: false,
  primaryColour: '#2196f3',
  dependenciesCheckOnStartup: true,
  filterOutdatedDependencies: false
};

export default class SettingsManager {
  settings: Settings = this._fetchSettings();

  /**
   * 'Private' methods
   */
  _getProjectDataDirectory() {
    const dataPath = ospath.data();
    const projectDataPath = path.join(dataPath, 'Clicky');

    if (!fs.existsSync(projectDataPath)) {
      fs.mkdirSync(projectDataPath);
    }

    return projectDataPath;
  }

  _getSettingsPath() {
    const dataPath = this._getProjectDataDirectory();
    return path.join(dataPath, 'settings.json');
  }

  _fetchSettings() {
    const settingsPath = this._getSettingsPath();

    let settings = defaultSettings;
    if (fs.existsSync(settingsPath)) {
      const file = fs.readFileSync(settingsPath, 'utf8');
      settings = file ? JSON.parse(file) : settings;
    }

    return settings;
  }

  /**
   * 'Public' methods
   */
  getSettings() {
    return this.settings;
  }

  setSettings(newSettings: $Shape<Settings>) {
    this.settings = Object.assign({}, this.settings, newSettings);
    fs.writeFileSync(
      this._getSettingsPath(),
      JSON.stringify(this.settings),
      'utf8'
    );
    return this.settings;
  }
}
