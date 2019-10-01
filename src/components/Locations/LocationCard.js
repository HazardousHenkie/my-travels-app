import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import CardActions from '@material-ui/core/CardActions'
import DeleteIcon from '@material-ui/icons/Delete'

import SnackbarContext from '../Snackbar/Context'

import * as routes from '../../constants/routes'

import { withFirebase } from '../Firebase'

const useStyles = makeStyles(() => ({
  image: {
    minHeight: 200,
    backgroundSize: 'contain'
  },
  removeButton: {
    marginLeft: 'auto'
  }
}))

const LocationCard = ({ location, edit, firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId, userName } = useSelector(state => state.user)
  const classes = useStyles()

  const { userNameLocation, userIdLocation } = location
  let userNameCard = ''
  let userNameCardId = null

  if (userIdLocation !== null && userIdLocation !== undefined) {
    userNameCard = userNameLocation
  } else {
    userNameCard = userName
  }

  if (userNameLocation !== '' && userNameLocation !== undefined) {
    userNameCardId = userIdLocation
  } else {
    userNameCardId = userId
  }

  const RemoveLocation = id => {
    const imageLocation = location.image
    firebase
      .locations()
      .child(userId)
      .child(id)
      .remove()
      .then(() => {
        if (imageLocation !== undefined) {
          const imageRef = firebase
            .firebase()
            .storage()
            .refFromURL(imageLocation)

          imageRef.delete()
        }
      })
      .catch(removeError => {
        setSnackbarState({ message: removeError, variant: 'error' })
      })

    setSnackbarState({ message: 'Location was removed!', variant: 'success' })
  }

  const avatarUserName = userNameCard.charAt(0)

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card key={location.id}>
        {/* eslint-disable */}
        <CardHeader
          avatar={
            <Avatar
              component={Link}
              to={{
                pathname: `${routes.profile}${userNameCardId}`,
                state: {
                  location
                }
              }}
              aria-label="Go to user"
            >
              {avatarUserName}
            </Avatar>
          }
          title={location.title}
        />
        {/* eslint-enable */}

        {location.image && (
          <CardMedia
            className={classes.image}
            image={location.image}
            title={location.title}
          />
        )}

        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {location.description}
          </Typography>
        </CardContent>

        {edit && (
          <CardActions disableSpacing>
            <IconButton
              onClick={() => RemoveLocation(location.id)}
              aria-label="delete location"
              className={classes.removeButton}
            >
              <DeleteIcon />
            </IconButton>

            <IconButton
              component={Link}
              to={{
                pathname: `${routes.editLocation}${location.id}`,
                state: {
                  location
                }
              }}
              aria-label="edit location"
            >
              <EditIcon />
            </IconButton>
          </CardActions>
        )}
      </Card>
    </Grid>
  )
}

export default withFirebase(LocationCard)
