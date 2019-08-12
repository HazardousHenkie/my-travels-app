import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { addUser } from '../../Redux/Actions'

import * as routes from '../../constants/routes'

import Firebase from '../Firebase/Firebase'
import history from '../../Helpers/History'

const SignInGoogle = () => {
  const [errorMessage, setError] = useState('')
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const onSubmit = async event => {
    event.preventDefault()

    try {
      const socialAuthUser = await Firebase.doSignInWithGoogle()
      await Firebase.user(socialAuthUser.user.uid).set({
        username: socialAuthUser.user.displayName,
        email: socialAuthUser.user.email
      })

      setError('')

      dispatch(
        addUser({
          loggedIn: true,
          userName: socialAuthUser.user.displayName,
          userId: socialAuthUser.user.uid
        })
      )

      history.push(routes.about)
    } catch (error) {
      setError({ error })
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>
      {user.userName}
      {user.userId}
      {errorMessage && <p>{errorMessage.message}</p>}
    </form>
  )
}

export default SignInGoogle
