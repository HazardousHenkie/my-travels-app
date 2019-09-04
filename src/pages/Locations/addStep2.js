import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
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

const AddStep2 = ({ firebase, location }) => {
  const classes = useStyles()
  const [files, setFiles] = useState([])
  const [uploadedFile, setUploadedFile] = useState('')
  const [finishedRequest, setFinishedRequest] = useState(false)
  const userId = useSelector(state => state.user.userId)
  const { setSnackbarState } = useContext(SnackbarContext)

  console.log(location)

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
          {finishedRequest && (
            <ImageUpload intialFiles={files} initialFile={uploadedFile} />
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default withFirebase(AddStep2)
