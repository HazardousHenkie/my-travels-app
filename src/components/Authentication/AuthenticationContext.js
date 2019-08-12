import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { addUser } from '../../Redux/Actions'
import Firebase from '../Firebase/Firebase'

const AuthenticatedContext = React.createContext()

function AuthenticatedProvider(props) {
  const { children } = props

  let authenticated = useSelector(state => state.user.loggedIn)

  const dispatch = useDispatch()

  Firebase.auth.onAuthStateChanged(authUser => {
    if (authUser) {
      dispatch(
        addUser({
          loggedIn: true,
          userName: authUser.displayName,
          userId: authUser.uid
        })
      )

      authenticated = true
    } else {
      dispatch(addUser({ loggedin: false, userName: '', userId: '' }))

      authenticated = false
    }
  })

  return (
    <AuthenticatedContext.Provider value={authenticated}>
      {children}
    </AuthenticatedContext.Provider>
  )
}

const AuthenticatedConsumer = AuthenticatedContext.Consumer

export { AuthenticatedContext, AuthenticatedProvider, AuthenticatedConsumer }
