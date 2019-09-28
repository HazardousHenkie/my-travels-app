import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import Group from '@material-ui/icons/Group'
import { makeStyles } from '@material-ui/core/styles'
import { addUser } from '../../Redux/Actions'
import * as routes from '../../constants/routes'
import history from '../../Helpers/History'
import { withFirebase } from '../Firebase'
import SnackbarContext from '../Snackbar/Context'

import './SignInGoogle.scss'

const useStyles = makeStyles(theme => ({
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

    firebase
      .doSignInWithGoogle()
      .then(signInResult => {
        if (signInResult.additionalUserInfo.isNewUser) {
          firebase.user(signInResult.user.uid).set({
            username: signInResult.user.displayName,
            email: signInResult.user.email
          })

          dispatch(
            addUser({
              loggedIn: true,
              userName: signInResult.user.displayName,
              userId: signInResult.user.uid
            })
          )
        } else {
          firebase.user(signInResult.user.uid).once('value', snapshot => {
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
                userId: signInResult.user.uid
              })
            )
          })
        }

        setSnackbarState({ message: 'Logged in!', variant: 'success' })
        history.push(routes.home)
      })
      .catch(error => {
        const { message } = error
        setSnackbarState({ message, variant: 'error' })
        history.push(routes.home)
      })
  }

  return (
    <div className="signin_google">
      <p className="signin_google__text">
        or alternatively Sign In with Google!
      </p>
      <form onSubmit={onSubmit}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          <Group className={classes.leftIcon} />
          Sign In with Google
        </Button>
      </form>
    </div>
  )
}

export default withFirebase(SignInGoogle)
