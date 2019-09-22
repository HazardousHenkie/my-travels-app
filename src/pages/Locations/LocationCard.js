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

import SnackbarContext from '../../components/Snackbar/Context'

import * as routes from '../../constants/routes'

import { withFirebase } from '../../components/Firebase'

const useStyles = makeStyles(() => ({
  image: {
    minHeight: 200,
    backgroundSize: 'contain'
  },
  removeButton: {
    marginLeft: 'auto'
  }
}))

const LocationCard = ({ location, firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const { userId } = useSelector(state => state.user)
  const classes = useStyles()
  let userName = ''

  userName = useSelector(state => state.user.userName)

  const RemoveLocation = id => {
    firebase
      .locations()
      .child(userId)
      .child(id)
      .remove()
    // remove image too
    setSnackbarState({ message: 'Location was removed!', variant: 'success' })
  }

  const avatarUserName = userName.charAt(0)

  return (
    <Grid item xs={4}>
      <Card key={location.id}>
        <CardHeader
          avatar={<Avatar aria-label="author">{avatarUserName}</Avatar>}
          title={location.title}
        />

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
      </Card>
    </Grid>
  )
}

export default withFirebase(LocationCard)
