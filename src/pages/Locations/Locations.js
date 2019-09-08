import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import { WithAuthorization } from '../../components/Authentication'
import SnackbarContext from '../../components/Snackbar/Context'

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
          console.log(typeof snapshot.val())
          setLocations(snapshot.val())
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
        <Grid container justify="center" spacing={2}>
          {locations &&
            Object.keys(locations).map(location => (
              <Card key={location.id}>
                <CardHeader
                  avatar={<Avatar aria-label="author">R</Avatar>}
                  title="Shrimp and Chorizo Paella"
                  subheader="September 14, 2016"
                />
                <CardMedia
                  className={classes.media}
                  image="/static/images/cards/paella.jpg"
                  title="Paella dish"
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    This impressive paella is a perfect party dish and a fun
                    meal to cook together with your guests. Add 1 cup of frozen
                    peas along with the mussels, if you like.
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default WithAuthorization(Locations)
