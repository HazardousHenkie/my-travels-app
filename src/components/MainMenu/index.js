import React from 'react'

import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import * as routes from '../../constants/routes'

import SignOutButton from '../SignOut'

import './MainMenu.scss'

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1
  }
}))

const MainMenu = () => {
  const authenticated = useSelector(state => state.user.loggedIn)
  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          My Application
        </Typography>

        <Button component={Link} to={routes.home} color="inherit">
          Home
        </Button>

        {authenticated > 0 && (
          <Button component={Link} to={routes.about} color="inherit">
            About
          </Button>
        )}

        {authenticated > 0 && (
          <Button component={Link} to={routes.profile} color="inherit">
            Profile
          </Button>
        )}

        {authenticated > 0 && <SignOutButton />}
      </Toolbar>
    </AppBar>
  )
}

export default MainMenu
