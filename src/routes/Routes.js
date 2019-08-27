import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import Profile from '../pages/Profile'
import Locations from '../pages/Locations'
import * as routes from '../constants/routes'

function Routes() {
  return (
    <Switch>
      <Route path={routes.home} exact component={Home} />
      <Route path={routes.about} exact component={About} />
      <Route path={routes.profile} exact component={Profile} />
      <Route path={routes.locations} exact component={Locations} />
      {/* <Route component={NoMatch} /> */}
    </Switch>
  )
}

export default Routes
