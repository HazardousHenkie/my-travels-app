import React, { useContext } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import { green } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import ErrorIcon from '@material-ui/icons/Error'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import SnackbarContext from './Context'

const variantIcon = {
  success: CheckCircleIcon,
  error: ErrorIcon
}

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const CustomSnackbar = () => {
  const classes = useStyles()
  const { snackbarState, setSnackbarState } = useContext(SnackbarContext)
  const Icon = variantIcon[snackbarState.variant]

  const message = (
    <span id="client-snackbar" className={classes.message}>
      <Icon className={clsx(classes.icon, classes.iconVariant)} />
      {snackbarState.message}
    </span>
  )

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarState({ message: '', variant: '' })
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={snackbarState.message !== ''}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={clsx(classes[snackbarState.variant], classes.margin)}
        message={message}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>
        ]}
      />
    </Snackbar>
  )
}

export default CustomSnackbar
