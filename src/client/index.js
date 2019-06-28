// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { A11yHandler } from './components';

import ThemeContext from './context/ThemeContext';
import ProcessContext from './context/ProcessContext';
import SearchContext from './context/SearchContext';
import SettingsContext from './context/SettingsContext';
import DependenciesContext from './context/DependenciesContext';
import ScriptsContext from './context/ScriptsContext';

import AppLayout from './layouts/AppLayout';

import './static/main.scss';

const App = () => (
  <A11yHandler>
    <SettingsContext.Provider>
      <ProcessContext.Provider>
        <SettingsContext.Consumer>
          {({ settings }) => (
            <ThemeContext.Provider
              themeOpts={{
                name: 'default',
                dark: settings.dark,
                primaryColour: settings.primaryColour
              }}
            >
              <SearchContext.Provider>
                <DependenciesContext.Provider>
                  <ScriptsContext.Provider>
                    <AppLayout />
                  </ScriptsContext.Provider>
                </DependenciesContext.Provider>
              </SearchContext.Provider>
            </ThemeContext.Provider>
          )}
        </SettingsContext.Consumer>
      </ProcessContext.Provider>
    </SettingsContext.Provider>
  </A11yHandler>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
}
