import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import AuthUserContext from './context'
import { addUser } from '../../Redux/Actions'

import { withFirebase } from '../Firebase'

const withAuthentication = Component => {
  function WithAuthentication(props) {
    const { firebase } = props
    const dispatch = useDispatch()
    const [authenticated, setAuthenticated] = useState(false)
    const { userId, loggedIn } = useSelector(state => state.user)

    useEffect(() => {
      const listener = firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          if (!loggedIn) {
            firebase.user(userId).once('value', snapshot => {
              dispatch(
                addUser({
                  loggedIn: true,
                  userName: snapshot.val().username,
                  userDescription:
                    snapshot.val().description !== null
                      ? snapshot.val().description
                      : '',
                  countries:
                    snapshot.val().countries !== undefined
                      ? snapshot.val().countries
                      : null,
                  userId: authUser.uid
                })
              )
            })
          }

          setAuthenticated(true)
        } else {
          dispatch(
            addUser({
              loggedin: false,
              userName: '',
              userDescription: '',
              userId: '',
              countries: null
            })
          )

          setAuthenticated(false)
        }
      })

      return () => listener()
    }, [setAuthenticated, firebase, dispatch, loggedIn, userId])
    return (
      <AuthUserContext.Provider value={authenticated}>
        <Component {...props} />
      </AuthUserContext.Provider>
    )
  }

  return withFirebase(WithAuthentication)
}

export default withAuthentication
