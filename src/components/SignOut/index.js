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
    marginBottom: '10px'
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
        history.push(routes.home)
      },
      error => {
        setSnackbarState({ message: 'Sign Out Error', variant: 'error' })
        error('Sign Out Error', error)
      }
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      color="secondary"
      className={classes.button}
    >
      Sign Out
    </Button>
  )
}

export default withFirebase(SignOutButton)
