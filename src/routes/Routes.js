import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Memo from '../pages/Memo'
import Profile from '../pages/Profile'
import MyProfile from '../pages/MyProfile'
import Locations from '../pages/Locations'
import SignUp from '../pages/SignUp'
import ForgotPassword from '../pages/ForgotPassword'
import AddEdit from '../pages/Locations/AddEdit'
import Error from '../pages/error'
import * as routes from '../constants/routes'

const Routes = () => {
  return (
    <Switch>
      <Route path={routes.home} exact component={Home} />
      <Route path={routes.memo} exact component={Memo} />
      <Route path={`${routes.profile}:id`} exact component={Profile} />
      <Route path={routes.myProfile} exact component={MyProfile} />
      <Route path={routes.locations} exact component={Locations} />
      <Route path={routes.signUp} exact component={SignUp} />
      <Route path={routes.forgotPassword} exact component={ForgotPassword} />
      <Route path={routes.addLocation} exact component={AddEdit} />
      <Route path={`${routes.editLocation}:id`} exact component={AddEdit} />
      <Route component={Error} />
    </Switch>
  )
}

export default Routes
