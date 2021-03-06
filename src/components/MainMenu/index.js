import React, { forwardRef } from 'react'

import { NavLink } from 'react-router-dom'

import { useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import * as routes from '../../constants/routes'

import './MainMenu.scss'

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none'
  },
  toolBar: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: '10px',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-end'
    }
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginRight: '10px',
    marginBottom: '10px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
  }
}))

const MainMenu = () => {
  const authenticated = useSelector(state => state.user.loggedIn)
  const classes = useStyles()
  const LinkRef = forwardRef((props, ref) => (
    <div ref={ref}>
      <NavLink exact {...props} />
    </div>
  ))

  LinkRef.displayName = 'LinkRef'

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar className={classes.toolBar}>
        <Button
          component={LinkRef}
          to={routes.home}
          className={classes.button}
          color="inherit"
        >
          Home
        </Button>

        {authenticated > 0 && (
          <Button
            component={LinkRef}
            to={routes.memo}
            className={classes.button}
            color="inherit"
          >
            Memo&apos;s
          </Button>
        )}

        {authenticated > 0 && (
          <Button
            component={LinkRef}
            className={classes.button}
            to={routes.locations}
            color="inherit"
          >
            My Locations
          </Button>
        )}

        {authenticated > 0 && (
          <Button
            component={LinkRef}
            to={routes.myProfile}
            className={classes.button}
            color="inherit"
          >
            Profile
          </Button>
        )}

        {authenticated > 0 && (
          <Button
            component={LinkRef}
            to={routes.signOut}
            className={classes.button}
            color="inherit"
          >
            Sign Out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default MainMenu
