import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import ImageUpload from '../ImageUpload'

import SnackbarContext from '../Snackbar/Context'
import { withFirebase } from '../Firebase'

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
    paddingBottom: '15px'
  }
})

const AddStep2 = ({ firebase, step2Props }) => {
  const classes = useStyles()
  const {
    setLoadedFile,
    uploadedFile,
    initialLocation,
    initialSetup,
    setInitialSetup
  } = step2Props

  const { id, imageURL } = initialLocation
  const [files, setFiles] = useState(
    imageURL !== undefined && imageURL !== ''
      ? [
          {
            source: imageURL,
            options: {
              type: 'local'
            }
          }
        ]
      : []
  )

  const [finishedRequest, setFinishedRequest] = useState(false)
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId } = useSelector(state => state.user)

  useEffect(() => {
    if (!initialSetup) {
      const unsubscribe = firebase
        .locations()
        .child(userId)
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

            setLoadedFile(snapshot.val().downloadURL)
          }

          setFinishedRequest(true)
        })
        .catch(removeError => {
          setSnackbarState({ message: removeError.message, variant: 'error' })
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
    setLoadedFile,
    userId
  ])

  const imageProps = {
    dbRef: firebase
      .locations()
      .child(userId)
      .child(id),
    intialFiles: files,
    initialFile: uploadedFile,
    setInitialSetup,
    setLoadedFile
  }

  return (
    <div className="locations__add_step_two">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="locations__inner">
            <header className="locations__header">
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
