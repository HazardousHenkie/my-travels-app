import React, { useState } from 'react'

import { useDispatch } from 'react-redux'
import AuthUserContext from './context'
import { addUser } from '../../Redux/Actions'

import { withFirebase } from '../Firebase'

const withAuthentication = Component => {
  function WithAuthentication(props) {
    const { firebase } = props
    const dispatch = useDispatch()
    const [authenticated, setAuthenticated] = useState(false)

    firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch(
          addUser({
            loggedIn: true,
            userName: authUser.displayName,
            userId: authUser.uid
          })
        )

        setAuthenticated(true)
      } else {
        dispatch(addUser({ loggedin: false, userName: '', userId: '' }))

        setAuthenticated(false)
      }
    })

    return (
      <AuthUserContext.Provider value={authenticated}>
        <Component {...props} />
      </AuthUserContext.Provider>
    )
  }

  return withFirebase(WithAuthentication)
}

export default withAuthentication
