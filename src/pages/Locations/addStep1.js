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

const AddStep1 = ({ firebase, setLocation }) => {
  const classes = useStyles()
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId } = useSelector(state => state.user)

  //use effect to get initial state if possible?

  return (
    <div className="locations_add_step_one">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="locations_inner">
            <header className="locations_header">
              <Typography variant="h5" component="h2" className={classes.title}>
                Add title and content
              </Typography>
            </header>
          </div>

          <Formik
            initialValues={{
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
                  .then(snapshot => {
                    const { key } = snapshot

                    setLocation({
                      id: key,
                      title: location,
                      description
                    })
                  })

                setSubmitting(false)

                setSnackbarState({
                  message: 'Profile was updated!',
                  variant: 'success'
                })
              } catch (error) {
                setSnackbarState({ message: error.message, variant: 'error' })
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
      </Grid>
    </div>
  )
}

export default withFirebase(AddStep1)
