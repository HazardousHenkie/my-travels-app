import React, { useState } from 'react'

import LocationContext from './Context'

// do we really need a HOC?

const withLocation = Component => {
  function WithLocation(props) {
    const [locationState, setLocationState] = useState({
      id: '',
      title: '',
      message: ''
    })

    return (
      <LocationContext.Provider
        value={{
          locationState,
          setLocationState
        }}
      >
        <Component {...props} />
      </LocationContext.Provider>
    )
  }

  return WithLocation
}

export default withLocation
