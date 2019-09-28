import React, { useContext } from 'react'

import { Link } from 'react-router-dom'

import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'

import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Email from '@material-ui/icons/Email'
import Typography from '@material-ui/core/Typography'

import { addUser } from '../../Redux/Actions'
import * as routes from '../../constants/routes'
import history from '../../Helpers/History'
import { withFirebase } from '../Firebase'

import SnackbarContext from '../Snackbar/Context'

import './SignInEmail.scss'

const SignupScheme = Yup.object().shape({
  email: Yup.string()
    .required('Required')
    .email(),
  password: Yup.string()
    .required('Required')
    .min(6)
})

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'calc(100% - 90px)'
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  title: {
    flexGrow: 1
  }
}))

const SignUpForm = ({ firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const dispatch = useDispatch()
  const classes = useStyles()

  return (
    <div className="signup_form">
      <Typography variant="h5" component="h2" className={classes.title}>
        Sign In
      </Typography>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignupScheme}
        onSubmit={async (values, { setSubmitting }) => {
          const { email, password } = values

          const emailAuthUser = firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
              firebase.user(emailAuthUser.user.uid).set({
                username: emailAuthUser.user.email,
                email: emailAuthUser.user.email
              })

              dispatch(
                addUser({
                  loggedIn: true,
                  userName: emailAuthUser.user.displayName,
                  userId: emailAuthUser.user.uid
                })
              )

              setSubmitting(false)
              setSnackbarState({ message: 'Logged in!', variant: 'success' })
              history.push(routes.home)
            })
            .catch(error => {
              const { message } = error
              setSnackbarState({ message, variant: 'error' })
              history.push(routes.home)
            })
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <Field
              type="text"
              name="email"
              label="email"
              component={TextField}
              className={classes.textField}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Field
              type="password"
              name="password"
              label="Password"
              component={TextField}
              className={classes.textField}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <p className="signup_form__password_link">
              Forgot your Password?
              <Link to={routes.forgotPassword} className="signup_form__link">
                Reset it!
              </Link>
            </p>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isSubmitting || !isValid}
              aria-label="signUp"
              className={classes.button}
            >
              <Email className={classes.leftIcon} />
              Sign In
            </Button>
          </Form>
        )}
      </Formik>

      <p>
        Don&apos;t have an account?
        <Link to={routes.signUp} className="signup_form__link">
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default withFirebase(SignUpForm)
