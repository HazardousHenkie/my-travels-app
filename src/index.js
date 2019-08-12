import React from 'react'
import ReactDOM from 'react-dom'

import './scss/Main.scss'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App'

import { store, persistor } from './Redux/Store'

import history from './Helpers/History'
import * as serviceWorker from './serviceWorker'

import { AuthenticatedProvider } from './components/Authentication/AuthenticationContext'

import 'typeface-roboto'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={history}>
        <AuthenticatedProvider>
          <App />
        </AuthenticatedProvider>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
