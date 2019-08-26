import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import Group from '@material-ui/icons/Group'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { addUser } from '../../Redux/Actions'
import * as routes from '../../constants/routes'
import history from '../../Helpers/History'
import { withFirebase } from '../Firebase'
import SnackbarContext from '../Snackbar/Context'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  button: {
    margin: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  }
}))

const SignInGoogle = ({ firebase }) => {
  const classes = useStyles()
  const { setSnackbarState } = useContext(SnackbarContext)
  const dispatch = useDispatch()
  const onSubmit = async event => {
    event.preventDefault()

    try {
      const socialAuthUser = await firebase.doSignInWithGoogle()

      if (socialAuthUser.additionalUserInfo.isNewUser) {
        await firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email
        })

        dispatch(
          addUser({
            loggedIn: true,
            userName: socialAuthUser.user.displayName,
            userId: socialAuthUser.user.uid
          })
        )
      } else {
        firebase.user(socialAuthUser.user.uid).once('value', snapshot => {
          dispatch(
            addUser({
              loggedIn: true,
              userName: snapshot.val().username,
              userDescription:
                snapshot.val().description !== null
                  ? snapshot.val().description
                  : '',
              countries:
                snapshot.val().countries !== undefined
                  ? snapshot.val().countries
                  : null,
              userId: socialAuthUser.user.uid
            })
          )
        })
      }

      setSnackbarState({ message: 'Logged in!', variant: 'success' })
      history.push(routes.about)
    } catch (error) {
      setSnackbarState({ message: error, variant: 'error' })
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Paper className={`${classes.root} center-content`}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          <Group className={classes.leftIcon}>send</Group>
          Sign In with Google
        </Button>
      </Paper>
    </form>
  )
}

export default withFirebase(SignInGoogle)
