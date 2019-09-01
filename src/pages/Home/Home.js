import React from 'react'
import Grid from '@material-ui/core/Grid'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import { useSelector } from 'react-redux'
import SignInGoogle from '../../components/Login/SignInGoogle'
import SignUpEmail from '../../components/SignUp/SignUpEmail'

import './Home.scss'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}))

function Home() {
  const loggedIn = useSelector(state => state.user.loggedIn)
  const user = useSelector(state => state.user)
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="Home">
          <header className="home_header">
            <Typography variant="h5" component="h2">
              {!loggedIn ? 'Welcome!' : `Welcome back, ${user.userName}!`}
            </Typography>
          </header>
          {!loggedIn && (
            <div className="signup_forms">
              <Paper className={`${classes.root} center-content`}>
                <SignUpEmail />
                <SignInGoogle />
              </Paper>
            </div>
          )}
        </div>
      </Grid>
    </Grid>
  )
}

export default Home
