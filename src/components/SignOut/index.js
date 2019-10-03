import React, { useContext } from 'react'

import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { withFirebase } from '../Firebase'

import { addUser } from '../../Redux/Actions'

import * as routes from '../../constants/routes'
import history from '../../Helpers/History'

import SnackbarContext from '../Snackbar/Context'

const useStyles = makeStyles(() => ({
  button: {
    marginBottom: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
  }
}))

const SignOutButton = ({ firebase }) => {
  const dispatch = useDispatch()
  const { setSnackbarState } = useContext(SnackbarContext)
  const classes = useStyles()

  const handleClick = event => {
    event.preventDefault()

    firebase.doSignOut().then(
      () => {
        dispatch(addUser({ loggedin: false, userName: '', userId: '' }))
        setSnackbarState({ message: 'Logged out', variant: 'error' })
      },
      error => {
        setSnackbarState({ message: 'Sign Out Error', variant: 'error' })
        error('Sign Out Error', error)
      }
    )

    history.push(routes.home)
  }

  return (
    <Button onClick={handleClick} className={classes.button} color="inherit">
      Sign Out
    </Button>
  )
}

export default withFirebase(SignOutButton)
