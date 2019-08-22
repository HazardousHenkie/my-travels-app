import React from 'react'

const defaultState = {
  show: false,
  type: 'succes',
  displayText: ''
}

const SnackbarContext = React.createContext(defaultState)

export default SnackbarContext
