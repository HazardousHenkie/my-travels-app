import React from 'react'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useSelector } from 'react-redux'

import SignOutButton from '../../components/SignOut'

import './LogOut.scss'

const useStyles = makeStyles(theme => ({
  rootPaper: {
    padding: theme.spacing(3, 2)
  },
  title: {
    flexGrow: 1
  },
  titleSub: {
    flexGrow: 1,
    marginBottom: '15px'
  }
}))

const LogOut = () => {
  const authenticated = useSelector(state => state.user.loggedIn)
  const classes = useStyles()

  return (
    <Grid className="log_out" container justify="center" spacing={2}>
      <Grid item xs={12} sm={6}>
        <header className="log_out__header">
          <Typography variant="h5" component="h2" className={classes.title}>
            Log out
          </Typography>
        </header>
        <Paper className={`${classes.rootPaper} center-content`}>
          <div className="log_out__button">
            <Typography
              variant="h6"
              component="h3"
              className={classes.titleSub}
            >
              Are you sure you want to logout?
            </Typography>

            {authenticated > 0 && <SignOutButton />}
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default LogOut
