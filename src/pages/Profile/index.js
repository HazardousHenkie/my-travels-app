import React, { useContext, useEffect, useState } from 'react'
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
import CountrySelect from './CountrySelect'

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
  const [files, setFiles] = useState([])
  const [uploadedFile, setUploadedFile] = useState('')
  const [finishedRequest, setFinishedRequest] = useState(false)
  const { userId, userName, userDescription, countries } = useSelector(
    state => state.user
  )

  const [multi, setMulti] = React.useState(countries)

  const HandleChangeMulti = value => {
    setMulti(value)
  }

  useEffect(() => {
    const unsubscribe = firebase
      .imagesUser()
      .child(userId)
      .once('value', snapshot => {
        if (snapshot.val() !== null) {
          setFiles([
            {
              source: snapshot.val().downloadURL,
              options: {
                type: 'local'
              }
            }
          ])

          setUploadedFile(snapshot.val().downloadURL)
        }

        setFinishedRequest(true)
      })
      .catch(removeError => {
        setSnackbarState({ message: removeError, variant: 'error' })
      })
    return () => unsubscribe
  }, [firebase, setSnackbarState, userId])

  const imageProps = {
    dbId: userId,
    dbRef: firebase.imageLocation(),
    intialFiles: files,
    initialFile: uploadedFile
  }

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
            initialValues={{
              name: userName,
              description: userDescription
            }}
            validationSchema={ProfileScheme}
            onSubmit={(values, { setSubmitting }) => {
              const { name, description } = values

              try {
                firebase.user(userId).update({
                  username: name,
                  description,
                  countries: multi !== null ? multi : null
                })

                dispatch(
                  updateUser({
                    userName: name,
                    userDescription: description,
                    countries: multi !== null ? multi : null
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
            {({ isSubmitting, isValid }) => (
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

                <CountrySelect
                  multi={multi}
                  handleChangeMulti={HandleChangeMulti}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting || !isValid}
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
          {finishedRequest && <ImageUpload imageProps={imageProps} />}
        </Grid>
      </Grid>
    </div>
  )
}

export default compose(
  withFirebase,
  WithAuthorization
)(Profile)
