import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import { WithAuthorization } from '../../components/Authentication'
import SnackbarContext from '../../components/Snackbar/Context'
import LocationCard from './LocationCard'

import './Locations.scss'

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    margin: '15px 0'
  }
}))

const Locations = ({ firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId } = useSelector(state => state.user)
  const [locations, setLocations] = useState([])
  const classes = useStyles()

  useEffect(() => {
    const unsubscribe = firebase
      .locations()
      .child(userId)
      .once('value', snapshot => {
        if (snapshot.val() !== null) {
          const locationObject = snapshot.val()

          const locationsArray = Object.keys(locationObject).map(key => ({
            title: locationObject[key].location,
            image: locationObject[key].downloadURL,
            description: locationObject[key].description,
            id: key
          }))

          setLocations(locationsArray)
        }
      })
      .catch(removeError => {
        setSnackbarState({ message: removeError, variant: 'error' })
      })
    return () => unsubscribe
  }, [firebase, setSnackbarState, userId])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="locations">
          <header className="locations__header">
            <Typography variant="h5" component="h2" className={classes.title}>
              My Locations
            </Typography>
          </header>
        </div>
        <Grid container spacing={2}>
          {console.log(locations)}
          {locations.length === 0 && (
            <CircularProgress className="messageLoading" />
          )}

          {locations &&
            locations.map(location => (
              <LocationCard location={location} key={location.id} />
            ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default WithAuthorization(Locations)
