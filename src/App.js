import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import MainMenu from './components/MainMenu/MainMenu'
import Routes from './routes/Routes'

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <CssBaseline />
        <Router>
          <MainMenu />
          <Container fixed>
            <Routes />
          </Container>
        </Router>
      </React.Fragment>
    </div>
  )
}

export default App
