import React, { useEffect } from 'react'

import AuthUserContext from './context'
import { withFirebase } from '../Firebase'

import history from '../../Helpers/History'

import * as routes from '../../constants/routes'

const withAuthorization = Component => {
  function WithAuthorization(props) {
    useEffect(() => {
      const listener = props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (!authUser) {
            history.push(routes.home)
          }
        },
        () => history.push(routes.home)
      )

      return () => listener
    }, [props])
    return (
      <AuthUserContext.Consumer>
        {authenticated =>
          authenticated === true ? <Component {...props} /> : authenticated
        }
      </AuthUserContext.Consumer>
    )
  }

  return withFirebase(WithAuthorization)
}

export default withAuthorization
