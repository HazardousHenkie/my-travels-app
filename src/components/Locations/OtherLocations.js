import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { WithAuthorization } from '../Authentication'
import SnackbarContext from '../Snackbar/Context'
import LocationCard from './LocationCard'

import './Locations.scss'

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    margin: '15px 0'
  }
}))

const OtherLocations = ({ firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId } = useSelector(state => state.user)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const classes = useStyles()

  // limit somehow // get own locations number and wait for this one to work.
  // add user properly

  useEffect(() => {
    const unsubscribe = firebase
      .locations()
      .limitToFirst(1)
      .once('value', snapshot => {
        if (snapshot.val() !== null) {
          const locationObject = snapshot.val()
          let userName = ''

          const locationsArray = Object.keys(locationObject).reduce((r, k) => {
            let newLocationObject = []

            if (k !== userId) {
              firebase.user(k).once('value', userSnapshot => {
                if (userSnapshot.val() !== null) {
                  userName = userSnapshot.val().username
                }
              })

              newLocationObject = Object.keys(locationObject[k]).map(key => ({
                userName,
                title: locationObject[k][key].location,
                image: locationObject[k][key].downloadURL,
                description: locationObject[k][key].description,
                id: key
              }))
            }

            return r.concat(newLocationObject)
          }, [])

          setLocations(locationsArray)
        } else {
          setLocations([])
        }

        setLoading(false)
      })
      .catch(error => {
        setSnackbarState({ message: error, variant: 'error' })
      })

    return () => unsubscribe()
  }, [firebase, setSnackbarState, userId])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="locations">
          <header className="locations__header">
            <Typography variant="h5" component="h2" className={classes.title}>
              Where to next? Check where other people have been!
            </Typography>
          </header>
        </div>

        {loading && <CircularProgress className="messageLoading" />}

        {locations && (
          <TransitionGroup component={Grid} container spacing={2}>
            {locations.map(location => (
              <CSSTransition key={location.id} timeout={500} classNames="item">
                <LocationCard location={location} key={location.id} />
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </Grid>
    </Grid>
  )
}

export default WithAuthorization(OtherLocations)
