import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'

function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/about" component={About} />
      {/* <Route component={NoMatch} /> */}
    </Switch>
  )
}

export default Routes
