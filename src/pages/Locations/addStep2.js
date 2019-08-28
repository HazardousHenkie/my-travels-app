import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ImageUpload from '../../components/ImageUpload'
import { withFirebase } from '../../components/Firebase'

const useStyles = makeStyles({
  title: {
    flexGrow: 1
  }
})

const AddStep2 = ({ firebase }) => {
  const classes = useStyles()

  const firebaseDbRef = firebase.imagesUser()

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

          <ImageUpload firebaseDbRef={firebaseDbRef} />
        </Grid>
      </Grid>
    </div>
  )
}

export default withFirebase(AddStep2)
