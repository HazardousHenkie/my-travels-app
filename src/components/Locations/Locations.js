import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { withFirebase } from '../Firebase'
import SnackbarContext from '../Snackbar/Context'
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
  const [loading, setLoading] = useState(true)
  const classes = useStyles()

  useEffect(() => {
    try {
      firebase
        .locations()
        .child(userId)
        .on('value', snapshot => {
          if (snapshot.val() !== null) {
            const locationObject = snapshot.val()

            const locationsArray = Object.keys(locationObject).map(key => ({
              title: locationObject[key].location,
              image: locationObject[key].downloadURL,
              description: locationObject[key].description,
              id: key
            }))

            setLocations(locationsArray)
          } else {
            setLocations([])
          }

          setLoading(false)
        })
    } catch (error) {
      setSnackbarState({ message: error, variant: 'error' })
    }
    return () =>
      firebase
        .locations()
        .child(userId)
        .off('value')
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

        {loading && <CircularProgress className="messageLoading" />}

        {locations && (
          <TransitionGroup component={Grid} container spacing={2}>
            {locations.map(location => (
              <CSSTransition key={location.id} timeout={500} classNames="item">
                <LocationCard edit location={location} key={location.id} />
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </Grid>
    </Grid>
  )
}

export default withFirebase(Locations)
