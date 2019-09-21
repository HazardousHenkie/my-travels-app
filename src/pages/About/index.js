import React from 'react'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import MessageList from '../../components/Messages'
import { WithAuthorization } from '../../components/Authentication'

import './About.scss'

const useStyles = makeStyles(theme => ({
  rootPaper: {
    padding: theme.spacing(3, 2)
  },
  title: {
    flexGrow: 1
  }
}))

const About = () => {
  const classes = useStyles()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <header className="about_header">
          <Typography variant="h5" component="h2" className={classes.title}>
            About
          </Typography>
        </header>
        <Paper className={`${classes.rootPaper} center-content`}>
          <div className="About">
            <MessageList />
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default WithAuthorization(About)
