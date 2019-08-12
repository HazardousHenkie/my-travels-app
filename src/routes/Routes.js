import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'

function Routes() {
  const PrivateRoute = ({ component, ...options }) => {
    const loggedIn = useSelector(state => state.user.loggedIn)

    if (!loggedIn) {
      return <Redirect to="/" />
    }

    return <Route {...options} component={component} />
  }

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <PrivateRoute path="/about" component={About} exact />
      {/* <Route component={NoMatch} /> */}
    </Switch>
  )
}

export default Routes
