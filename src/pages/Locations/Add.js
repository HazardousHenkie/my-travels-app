import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
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

const LocationsScheme = Yup.object().shape({
  location: Yup.string().required('Required'),
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

const Add = ({ firebase }) => {
  const classes = useStyles()
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId } = useSelector(state => state.user)

  return (
    <div className="locations">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="locations_inner">
            <header className="locations_header">
              <Typography variant="h5" component="h2" className={classes.title}>
                Add Location
              </Typography>
            </header>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Formik
            initialValues={{
              // set initial locations
              location: '',
              description: ''
            }}
            validationSchema={LocationsScheme}
            onSubmit={(values, { setSubmitting }) => {
              const { location, description } = values

              try {
                firebase
                  .locations()
                  .child(userId)
                  .push({
                    location,
                    description
                  })

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
                  name="location"
                  label="location"
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
)(Add)
