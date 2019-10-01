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

const OtherLocations = ({ firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId } = useSelector(state => state.user)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const classes = useStyles()

  // we actually don't want to get all locations now but we want to limit it
  // unfortunately firebase has some constrains so this is not possible
  // so since this is a small application we're splicing it below for now
  useEffect(() => {
    const unsubscribe = firebase
      .locations()
      .once('value')
      .then(async snapshot => {
        if (snapshot.exists()) {
          const promises = []

          snapshot.slice(0, 10).forEach(element => {
            promises.push(firebase.user(element.key).once('value'))
          })

          const snapshotValues = snapshot.val()

          return Promise.all(promises).then(snapshots => ({
            snapshots,
            snapshotValues
          }))
        }
        setLocations([])
        setLoading(false)
        return null
      })
      .then(({ snapshots, snapshotValues }) => {
        const userInformation = []

        snapshots.forEach(userSnapshot => {
          if (userSnapshot.exists()) {
            userInformation.push({
              userId: userSnapshot.key,
              name: userSnapshot.val().username
            })
          }
        })

        const locationsArray = Object.keys(snapshotValues).reduce((r, k) => {
          let newLocationObject = []

          if (k !== userId) {
            newLocationObject = Object.keys(snapshotValues[k]).map(key => ({
              // find might not be good for performance on large objects but we are only getting 10 so it should be fine
              userIdLocation: userInformation.find(user => user.userId === k)
                .userId,
              userNameLocation: userInformation.find(user => user.userId === k)
                .name,
              title: snapshotValues[k][key].location,
              image: snapshotValues[k][key].downloadURL,
              description: snapshotValues[k][key].description,
              id: key
            }))
          }

          return r.concat(newLocationObject)
        }, [])

        setLocations(locationsArray)

        setLoading(false)
      })
      .catch(error => {
        setSnackbarState({ message: error.message, variant: 'error' })
      })
    return () => unsubscribe
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

export default withFirebase(OtherLocations)
