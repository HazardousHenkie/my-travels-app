import React, { useState } from 'react'

import SnackbarContext from './Context'
import CustomSnackbar from './Snackbar'

const withSnackbar = Component => {
  function WithSnackbar(props) {
    const [snackbarState, setSnackbarState] = useState({
      message: '',
      variant: ''
    })

    return (
      <SnackbarContext.Provider
        value={{
          snackbarState,
          setSnackbarState
        }}
      >
        {snackbarState.message !== '' && <CustomSnackbar />}

        <Component {...props} />
      </SnackbarContext.Provider>
    )
  }

  return WithSnackbar
}

export default withSnackbar
