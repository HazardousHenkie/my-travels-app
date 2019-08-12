import React from 'react'
import Grid from '@material-ui/core/Grid'
import MessageList from '../../components/Messages/MessageList'

function About() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="About">
          <header className="about-header">about</header>
          <MessageList />
        </div>
      </Grid>
    </Grid>
  )
}

export default About
