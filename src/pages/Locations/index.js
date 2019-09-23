import React from 'react'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'

import EditIcon from '@material-ui/icons/Edit'

import { WithAuthorization } from '../../components/Authentication'

import Locations from '../../components/Locations/Locations'

import * as routes from '../../constants/routes'

import './Index.scss'

const useStyles = makeStyles(() => ({
  fab: {
    margin: '14px 0'
  }
}))

const LocationsIndex = () => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="locations_index">
          <Locations edit />

          <div className="locations_index__add_button">
            <Fab
              component={Link}
              variant="extended"
              color="secondary"
              aria-label="add"
              to={routes.addLocation}
              className={classes.fab}
            >
              <EditIcon />
              Add Location
            </Fab>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default WithAuthorization(LocationsIndex)
