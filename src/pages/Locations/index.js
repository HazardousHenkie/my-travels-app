import React from 'react'
import Grid from '@material-ui/core/Grid'
import { WithAuthorization } from '../../components/Authentication'
import Add from './Add'
import Locations from './Locations'

const LocationsIndex = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="locations_index">
          <header className="locations_index__header">
            <Locations />
            <Add />
          </header>
        </div>
      </Grid>
    </Grid>
  )
}

export default WithAuthorization(LocationsIndex)
