import React from 'react'

import Typography from '@material-ui/core/Typography'

import './error.scss'

const Error = () => {
  return (
    <div className="error">
      <header className="error__header">
        <Typography variant="h1" component="h1">
          404 Page Not Found
        </Typography>
      </header>
    </div>
  )
}

export default Error
