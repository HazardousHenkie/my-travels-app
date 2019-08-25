import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { compose } from 'recompose'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import ImageUpload from '../../components/ImageUpload'
import { WithAuthorization } from '../../components/Authentication'
import SnackbarContext from '../../components/Snackbar/Context'
import { withFirebase } from '../../components/Firebase'
import { updateUser } from '../../Redux/Actions'

const ProfileScheme = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required')
})

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}))

const Profile = ({ firebase }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId, userName, userDescription } = useSelector(state => state.user)

  return (
    <div className="profile">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="profile">
            <header className="about_header">
              <Typography variant="h5" component="h2" className={classes.title}>
                Profile
              </Typography>
            </header>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Formik
            initialValues={{ name: userName, description: userDescription }}
            validationSchema={ProfileScheme}
            onSubmit={(values, { setSubmitting }) => {
              const { name, description } = values

              try {
                firebase.user(userId).update({
                  username: name,
                  description
                })

                dispatch(
                  updateUser({
                    userName: name,
                    userDescription: description
                  })
                )

                setSubmitting(false)

                setSnackbarState({
                  message: 'Profile was updated!',
                  variant: 'success'
                })
              } catch (error) {
                setSnackbarState({ message: error, variant: 'error' })
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  type="text"
                  name="name"
                  label="Name"
                  component={TextField}
                  className={classes.textField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />

                <Field
                  type="text"
                  name="description"
                  label="Introduction"
                  component={TextField}
                  className={classes.textField}
                  multiline
                  rows={6}
                  rowsMax={8}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                  aria-label="add"
                  className={classes.button}
                >
                  Save
                  <EditIcon className={classes.rightIcon} />
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={6}>
          <ImageUpload />
        </Grid>
      </Grid>
    </div>
  )
}

export default compose(
  withFirebase,
  WithAuthorization
)(Profile)
