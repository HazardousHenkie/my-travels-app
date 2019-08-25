import { ADD_USER, UPDATE_USER } from '../ActionTypes'

const initialState = {
  loggedIn: false,
  userName: '',
  userId: '',
  userDescription: ''
}
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_USER: {
      console.log(action.type)
      return {
        loggedIn: action.payload.loggedIn,
        userName: action.payload.userName,
        userId: action.payload.userId
      }
    }
    case UPDATE_USER: {
      console.log(action.type)
      console.log(action)
      return {
        userName: action.payload.userName,
        userDescription: action.payload.userDescription
      }
    }
    default:
      return state
  }
}
