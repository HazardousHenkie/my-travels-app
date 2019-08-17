import React from 'react'

import { Router } from 'react-router-dom'

import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import Routes from './routes/Routes'
import MainMenu from './components/MainMenu'
import history from './Helpers/History'

import { WithAuthentication } from './components/Authentication'

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#343434'
    }
  }
})
theme = responsiveFontSizes(theme)

const App = () => (
  <div className="App">
    <React.Fragment>
      <CssBaseline />
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <MainMenu />
          <Container fixed>
            <Routes />
          </Container>
        </ThemeProvider>
      </Router>
    </React.Fragment>
  </div>
)

export default WithAuthentication(App)
