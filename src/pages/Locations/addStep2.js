import React, { useState, useEffect, useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ImageUpload from '../../components/ImageUpload'
import SnackbarContext from '../../components/Snackbar/Context'
import { withFirebase } from '../../components/Firebase'

const useStyles = makeStyles({
  title: {
    flexGrow: 1
  }
})

const AddStep2 = ({ firebase, step2Props }) => {
  const classes = useStyles()
  const {
    setUploadedFile,
    uploadedFile,
    initialLocation,
    initialSetup,
    setInitialSetup
  } = step2Props
  const [files, setFiles] = useState([])
  const [finishedRequest, setFinishedRequest] = useState(false)
  const { setSnackbarState } = useContext(SnackbarContext)
  const { id } = initialLocation

  console.log('step2', uploadedFile)

  useEffect(() => {
    if (!initialSetup) {
      const unsubscribe = firebase
        .imageLocation()
        .child(id)
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
    }
    setFinishedRequest(true)
    return () => null
  }, [
    firebase,
    setSnackbarState,
    id,
    initialSetup,
    setInitialSetup,
    setUploadedFile
  ])

  const imageProps = {
    dbId: id,
    dbRef: firebase.imageLocation(),
    intialFiles: files,
    initialFile: uploadedFile,
    setInitialSetup
  }

  return (
    <div className="locations_add_step_one">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="locations_inner">
            <header className="locations_header">
              <Typography variant="h5" component="h2" className={classes.title}>
                Add image
              </Typography>
            </header>
          </div>
          {finishedRequest && <ImageUpload imageProps={imageProps} />}
        </Grid>
      </Grid>
    </div>
  )
}

export default withFirebase(AddStep2)
