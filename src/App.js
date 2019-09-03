import React from 'react'
import { compose } from 'recompose'

import { Router } from 'react-router-dom'

import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

import Routes from './routes/Routes'
import MainMenu from './components/MainMenu'
import Footer from './components/Footer'
import history from './Helpers/History'

import { WithAuthentication } from './components/Authentication'
import { withSnackbar } from './components/Snackbar'

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
        <div className="content">
          <ThemeProvider theme={theme}>
            <MainMenu />
            <Container fixed>
              <Routes />
            </Container>
          </ThemeProvider>
        </div>
        <Footer />
      </Router>
    </React.Fragment>
  </div>
)

export default compose(
  withSnackbar,
  WithAuthentication
)(App)
