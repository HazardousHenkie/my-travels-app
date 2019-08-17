import React from 'react'

import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import { withFirebase } from '../Firebase'

import { addUser } from '../../Redux/Actions'

import * as routes from '../../constants/routes'
import history from '../../Helpers/History'

const SignOutButton = ({ firebase }) => {
  const dispatch = useDispatch()

  const handleClick = event => {
    event.preventDefault()

    firebase.doSignOut().then(
      () => {
        dispatch(addUser({ loggedin: false, userName: '', userId: '' }))
      },
      error => {
        error('Sign Out Error', error)
      }
    )

    history.push(routes.home)
  }

  return (
    <Button color="inherit" onClick={handleClick}>
      Sign Out
    </Button>
  )
}

export default withFirebase(SignOutButton)
