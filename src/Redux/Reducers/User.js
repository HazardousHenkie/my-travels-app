import { ADD_USER } from '../ActionTypes'

const initialState = {
  loggedIn: false,
  userName: '',
  userId: ''
}
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_USER: {
      return {
        loggedIn: action.payload.loggedIn,
        userName: action.payload.userName,
        userId: action.payload.userId
      }
    }
    default:
      return state
  }
}
