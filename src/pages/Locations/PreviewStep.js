import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  title: {
    flexGrow: 1
  }
})

const PreviewStep = ({ location, uploadedFile }) => {
  const classes = useStyles()

  console.log(location)
  console.log(uploadedFile)

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
        </Grid>
      </Grid>
    </div>
  )
}

export default PreviewStep
