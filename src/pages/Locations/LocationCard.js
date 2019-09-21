import React from 'react'
import { useSelector } from 'react-redux'

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

const useStyles = makeStyles(() => ({
  image: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  editButton: {
    marginLeft: 'auto'
  }
}))

const LocationCard = ({ location }) => {
  const classes = useStyles()
  let userName = ''

  // check url for id and if not in url get from store

  userName = useSelector(state => state.user.userName)

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
          <IconButton className={classes.editButton} aria-label="edit location">
            <EditIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default LocationCard
