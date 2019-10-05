import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import './LocationPreview.scss'

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
    paddingBottom: '15px'
  }
})

const PreviewStep = ({ location, uploadedFile }) => {
  const classes = useStyles()
  const { title, description } = location

  return (
    <div className="location_preview">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="location_preview__inner">
            <header className="location_preview__header">
              <Typography variant="h5" component="h2" className={classes.title}>
                Preview
              </Typography>
            </header>
          </div>

          <h3 className="location_preview__title">{title}</h3>
          <p className="location_preview__content">{description}</p>

          {uploadedFile && (
            <img
              className="location_preview__image"
              src={uploadedFile}
              title={title}
              alt={title}
            />
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default PreviewStep
