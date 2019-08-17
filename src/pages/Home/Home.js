import React from 'react'
import Grid from '@material-ui/core/Grid'

import Typography from '@material-ui/core/Typography'
import { useSelector } from 'react-redux'
import SignInGoogle from '../../components/Login/SignInGoogle'

import './Home.scss'

function Home() {
  const loggedIn = useSelector(state => state.user.loggedIn)
  const user = useSelector(state => state.user)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="Home">
          <header className="home_header">
            <Typography variant="h5" component="h2">
              {!loggedIn ? 'Welcome!' : `Welcome back, ${user.userName}!`}
            </Typography>
          </header>
          {!loggedIn && <SignInGoogle />}
        </div>
      </Grid>
    </Grid>
  )
}

export default Home
