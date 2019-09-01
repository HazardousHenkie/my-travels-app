import React, { useState, useContext } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Fade from '@material-ui/core/Fade'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import SnackbarContext from '../Snackbar/Context'
import { withFirebase } from '../Firebase'

const MessageScheme = Yup.object().shape({
  editMessage: Yup.string().required('Required')
})

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'calc(100% - 90px)'
  },
  fab: {
    margin: '14px 8px'
  }
}))

const MessageListItem = ({ firebase, message }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const [panel, setPanel] = useState(false)
  const classes = useStyles()

  const onRemoveMessage = uid => {
    firebase.message(uid).remove()
    setSnackbarState({ message: 'Message was deleted!', variant: 'success' })
  }

  const onEditMessage = () => {
    setPanel(!panel)
  }

  return (
    <div className="message_list_item">
      <ListItem alignItems="flex-start">
        <ListItemText
          primary="Message"
          secondary={`${message.text} ${message.date}`}
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => onEditMessage()}
            edge="end"
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => onRemoveMessage(message.uid)}
            edge="end"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      {panel && (
        <Fade in={panel} timeout={350}>
          <div className="toggle_panel">
            <Formik
              initialValues={{ editMessage: message.text }}
              validationSchema={MessageScheme}
              onSubmit={(values, { setSubmitting }) => {
                const { editMessage } = values

                try {
                  firebase.message(message.uid).update({
                    text: editMessage
                  })
                  setSubmitting(false)
                  setPanel(false)

                  setSnackbarState({
                    message: 'Message was created!',
                    variant: 'success'
                  })
                } catch (error) {
                  setSnackbarState({ message: error, variant: 'error' })
                  setSubmitting(false)
                }
              }}
            >
              {({ isSubmitting, isValid }) => (
                <Form>
                  <Field
                    type="text"
                    name="editMessage"
                    label="Message"
                    component={TextField}
                    className={classes.textField}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />

                  <Fab
                    type="submit"
                    variant="round"
                    color="secondary"
                    disabled={isSubmitting || isValid}
                    aria-label="add"
                    className={classes.fab}
                  >
                    <EditIcon />
                  </Fab>
                </Form>
              )}
            </Formik>
          </div>
        </Fade>
      )}
    </div>
  )
}

export default withFirebase(MessageListItem)
