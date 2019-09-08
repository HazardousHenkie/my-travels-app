import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { WithAuthorization } from '../../components/Authentication'
import Add from './Add'
import Locations from './Locations'

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    margin: '15px 0'
  }
}))

const LocationsIndex = () => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="locations_index">
          <header className="locations_index__header">
            <Typography variant="h5" component="h2" className={classes.title}>
              My Locations
            </Typography>
            <Locations />
            <Add />
          </header>
        </div>
      </Grid>
    </Grid>
  )
}

export default WithAuthorization(LocationsIndex)
