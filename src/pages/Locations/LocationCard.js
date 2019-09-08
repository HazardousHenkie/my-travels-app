import React from 'react'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const LocationCard = ({ location }) => {
  return (
    <Grid item xs={4}>
      <Card key={location.id}>
        <CardHeader
          avatar={<Avatar aria-label="author">R</Avatar>}
          title={location.title}
        />
        <CardMedia image={location.image} title="Paella dish" />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {location.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default LocationCard
