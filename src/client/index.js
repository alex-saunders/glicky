// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { A11yHandler } from './components';

import ThemeContext from './context/ThemeContext';
import SocketContext from './context/SocketContext';
import ProcessContext from './context/ProcessContext';
import SearchContext from './context/SearchContext';
import SettingsContext from './context/SettingsContext';
import DependenciesContext from './context/DependenciesContext';
import ScriptsContext from './context/ScriptsContext';

import AppLayout from './layouts/AppLayout';

import './static/main.scss';

const App = () => (
  <A11yHandler>
    <SocketContext.Provider>
      <SocketContext.Consumer>
        {({ socket }) => (
          <SettingsContext.Provider socket={socket}>
            <ProcessContext.Provider socket={socket}>
              <ThemeContext.Provider>
                <SearchContext.Provider socket={socket}>
                  <DependenciesContext.Provider socket={socket}>
                    <ScriptsContext.Provider socket={socket}>
                      <AppLayout />
                    </ScriptsContext.Provider>
                  </DependenciesContext.Provider>
                </SearchContext.Provider>
              </ThemeContext.Provider>
            </ProcessContext.Provider>
          </SettingsContext.Provider>
        )}
      </SocketContext.Consumer>
    </SocketContext.Provider>
  </A11yHandler>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
}
