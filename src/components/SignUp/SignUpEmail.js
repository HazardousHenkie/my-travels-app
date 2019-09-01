import React, { useContext } from 'react'

import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'

import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Group from '@material-ui/icons/Group'

import { addUser } from '../../Redux/Actions'
import * as routes from '../../constants/routes'
import history from '../../Helpers/History'
import { withFirebase } from '../Firebase'

import SnackbarContext from '../Snackbar/Context'

const SignupScheme = Yup.object().shape({
  email: Yup.string().required('Required'),
  passwordOne: Yup.string()
    .required('Required')
    .email()
    .min(6),
  passwordTwo: Yup.string().oneOf(
    [Yup.ref('passwordOne'), null],
    'Passwords must match'
  )
})

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'calc(100% - 90px)'
  },
  fab: {
    margin: '14px 8px'
  }
}))

const SignUpForm = ({ firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const dispatch = useDispatch()
  const classes = useStyles()

  return (
    <div className="signup_form">
      <h1>Sign Up</h1>
      <Formik
        initialValues={{ email: '', passwordOne: '', passwordTwo: '' }}
        validationSchema={SignupScheme}
        onSubmit={async (values, { setSubmitting }) => {
          const { email, passwordOne } = values

          try {
            const emailAuthUser = await firebase.doCreateUserWithEmailAndPassword(
              email,
              passwordOne
            )

            await firebase.user(emailAuthUser.user.uid).set({
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
            history.push(routes.about)
          } catch (error) {
            setSubmitting(false)
            setSnackbarState({ message: error.message, variant: 'error' })
          }
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
              name="passwordOne"
              label="Password"
              component={TextField}
              className={classes.textField}
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Field
              type="password"
              name="passwordTwo"
              label="Confirm Password"
              component={TextField}
              className={classes.textField}
              variant="outlined"
              margin="normal"
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isSubmitting || !isValid}
              aria-label="signUp"
              className={classes.button}
            >
              <Group className={classes.leftIcon}>send</Group>
              Sign signUp
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default withFirebase(SignUpForm)
