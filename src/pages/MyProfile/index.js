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
import Paper from '@material-ui/core/Paper'

import * as Yup from 'yup'
import ImageUpload from '../../components/ImageUpload'
import { WithAuthorization } from '../../components/Authentication'
import SnackbarContext from '../../components/Snackbar/Context'
import { withFirebase } from '../../components/Firebase'
import { updateUser } from '../../Redux/Actions'
import CountrySelect from '../../components/CountrySelect'

import RemoveAccount from '../../components/RemoveAccount'

const ProfileScheme = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required')
})

const useStyles = makeStyles(theme => ({
  rootPaper: {
    padding: theme.spacing(3, 2)
  },
  title: {
    flexGrow: 1
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    maxWidth: 'calc(100% - 15px)'
  },
  button: {
    margin: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}))

const MyProfile = ({ firebase }) => {
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
    firebase
      .user(userId)
      .once('value', snapshot => {
        if (
          snapshot.val() !== null &&
          snapshot.val().downloadURL !== undefined
        ) {
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
  }, [firebase, setSnackbarState, userId])

  const imageProps = {
    dbId: userId,
    dbRef: firebase.user(userId),
    intialFiles: files,
    initialFile: uploadedFile
  }

  return (
    <div className="profile">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <header className="profile__header">
            <Typography variant="h5" component="h2" className={classes.title}>
              Profile
            </Typography>
          </header>
        </Grid>
      </Grid>
      <Paper className={`${classes.rootPaper} center-content`}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Formik
              initialValues={{
                name: userName,
                description: userDescription
              }}
              validationSchema={ProfileScheme}
              onSubmit={(values, { setSubmitting }) => {
                const { name, description } = values

                firebase
                  .user(userId)
                  .update({
                    username: name,
                    description,
                    countries: multi !== undefined ? multi : null
                  })
                  .catch(error => {
                    setSnackbarState({
                      message: error.message,
                      variant: 'error'
                    })
                    setSubmitting(false)
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
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    type="text"
                    name="name"
                    component={TextField}
                    className={classes.textField}
                    id="name"
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />

                  <Field
                    type="text"
                    name="description"
                    component={TextField}
                    className={classes.textField}
                    label="Introduction"
                    id="description"
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
                    disabled={isSubmitting}
                    className={classes.button}
                  >
                    Save
                    <EditIcon className={classes.rightIcon} />
                  </Button>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} sm={6}>
            {finishedRequest && <ImageUpload imageProps={imageProps} />}

            <RemoveAccount />
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default compose(
  withFirebase,
  WithAuthorization
)(MyProfile)
