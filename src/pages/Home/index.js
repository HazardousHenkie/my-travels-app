import React from 'react'
import Grid from '@material-ui/core/Grid'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import { useSelector } from 'react-redux'
import SignInGoogle from '../../components/Login/SignInGoogle'
import SignInEmail from '../../components/Login/SignInEmail'

import Locations from '../../components/Locations/Locations'
import OtherLocations from '../../components/Locations/OtherLocations'

import './Home.scss'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}))

const Home = () => {
  const loggedIn = useSelector(state => state.user.loggedIn)
  const { userName } = useSelector(state => state.user)
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={7} md={5}>
        <div className="home">
          <header className="home__header">
            <Typography variant="h5" component="h2">
              {!loggedIn ? 'Welcome!' : `Welcome back, ${userName}!`}
            </Typography>
          </header>
          {!loggedIn && (
            <div className="home__signup_forms">
              <Paper className={`${classes.root} center-content`}>
                <SignInEmail />
                <SignInGoogle />
              </Paper>
            </div>
          )}
        </div>
      </Grid>
      <Grid item xs={12}>
        {loggedIn && <Locations />}

        {loggedIn && <OtherLocations />}
      </Grid>
    </Grid>
  )
}

export default Home
