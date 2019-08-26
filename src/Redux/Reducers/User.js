import { ADD_USER, UPDATE_USER } from '../ActionTypes'

const initialState = {
  loggedIn: false,
  userName: '',
  userId: '',
  userDescription: '',
  countries: []
}
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_USER: {
      return {
        loggedIn: action.payload.loggedIn,
        userName: action.payload.userName,
        userId: action.payload.userId,
        userDescription: action.payload.userDescription,
        countries: action.payload.countries
      }
    }
    case UPDATE_USER: {
      return {
        loggedIn: state.loggedIn,
        userName: action.payload.userName,
        userId: state.userId,
        userDescription: action.payload.userDescription,
        countries: action.payload.countries
      }
    }
    default:
      return state
  }
}
