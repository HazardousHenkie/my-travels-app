import { ADD_USER, UPDATE_USER } from './ActionTypes'

export const addUser = userInfo => ({
  type: ADD_USER,
  payload: {
    loggedIn: userInfo.loggedIn,
    userName: userInfo.userName,
    userId: userInfo.userId,
    userDescription: userInfo.userDescription
  }
})

export const updateUser = userInfo => ({
  type: UPDATE_USER,
  payload: {
    userName: userInfo.userName,
    userDescription: userInfo.userDescription
  }
})
