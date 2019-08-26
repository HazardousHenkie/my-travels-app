import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import Profile from '../pages/Profile'

function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/about" exact component={About} />
      <Route path="/profile" exact component={Profile} />
      {/* <Route component={NoMatch} /> */}
    </Switch>
  )
}

export default Routes
