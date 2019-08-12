import React from 'react'
import Grid from '@material-ui/core/Grid'

import SignInGoogle from '../../components/Login/SignInGoogle'

function Home() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="Home">
          <header className="Home-header">Homes</header>
          <SignInGoogle />
        </div>
      </Grid>
    </Grid>
  )
}

export default Home
