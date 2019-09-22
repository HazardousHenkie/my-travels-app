import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Profile from '../pages/Profile'
import Locations from '../pages/Locations'
import SignUp from '../pages/SignUp'
import ForgotPassword from '../pages/ForgotPassword'
import AddEdit from '../pages/Locations/AddEdit'
import * as routes from '../constants/routes'

const Routes = () => {
  return (
    <Switch>
      <Route path={routes.home} exact component={Home} />
      <Route path={routes.about} exact component={About} />
      <Route path={routes.profile} exact component={Profile} />
      <Route path={routes.locations} exact component={Locations} />
      <Route path={routes.signUp} exact component={SignUp} />
      <Route path={routes.forgotPassword} exact component={ForgotPassword} />
      <Route path={routes.addLocation} exact component={AddEdit} />
      <Route path={`${routes.editLocation}:id`} exact component={AddEdit} />
      {/* <Route component={NoMatch} /> */}
    </Switch>
  )
}

export default Routes
