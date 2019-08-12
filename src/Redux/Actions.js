import { ADD_USER } from './ActionTypes'

export const addUser = userInfo => ({
  type: ADD_USER,
  payload: {
    loggedIn: userInfo.loggedIn,
    userName: userInfo.userName,
    userId: userInfo.userId
  }
})
