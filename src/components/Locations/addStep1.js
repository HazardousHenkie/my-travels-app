import React, { useContext } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'

import * as Yup from 'yup'

import SnackbarContext from '../Snackbar/Context'
import { withFirebase } from '../Firebase'

const LocationsScheme = Yup.object().shape({
  location: Yup.string().required('Required'),
  descriptionForm: Yup.string().required('Required')
})

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}))

const AddStep1 = ({ firebase, setEdit, setLocation, initialLocation }) => {
  const classes = useStyles()
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId } = useSelector(state => state.user)
  const { id, title, description, imageURL } = initialLocation

  return (
    <div className="locations__add_step_one">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="locations__inner">
            <header className="locations__header">
              <Typography variant="h5" component="h2" className={classes.title}>
                Title and content
              </Typography>
            </header>
          </div>

          <Formik
            initialValues={{
              location: title,
              descriptionForm: description
            }}
            validationSchema={LocationsScheme}
            onSubmit={(values, { setSubmitting }) => {
              const { location, descriptionForm } = values

              if (id !== '') {
                firebase
                  .locations()
                  .child(userId)
                  .child(id)
                  .update({
                    location,
                    description: descriptionForm
                  })
                  .then(() => {
                    setLocation({
                      id,
                      title: location,
                      description: descriptionForm,
                      imageURL
                    })
                  })
                  .catch(error => {
                    setSnackbarState({
                      message: error.message,
                      variant: 'error'
                    })
                    setSubmitting(false)
                  })

                setSnackbarState({
                  message: 'Location was updated!',
                  variant: 'success'
                })
              } else {
                firebase
                  .locations()
                  .child(userId)
                  .push({
                    location,
                    description: descriptionForm
                  })
                  .then(snapshot => {
                    const { key } = snapshot

                    setLocation({
                      id: key,
                      title: location,
                      description: descriptionForm
                    })
                  })

                setSnackbarState({
                  message: 'Location was added!',
                  variant: 'success'
                })
              }

              setEdit(true)
              setSubmitting(false)
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  type="text"
                  name="location"
                  component={TextField}
                  id="location"
                  label="Location"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />

                <Field
                  type="text"
                  name="descriptionForm"
                  component={TextField}
                  id="descriptionForm"
                  label="Introduction"
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
                  aria-label="Add title and description"
                  className={classes.button}
                >
                  Save
                  <EditIcon className={classes.rightIcon} />
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </div>
  )
}

export default withFirebase(AddStep1)
