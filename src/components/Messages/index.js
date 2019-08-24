import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { compose } from 'recompose'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import { withFirebase } from '../Firebase'
import SnackbarContext from '../Snackbar/Context'

const MessageScheme = Yup.object().shape({
  message: Yup.string()
    .required('Required')
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
})

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'calc(100% - 90px)'
  },
  fab: {
    margin: '14px 8px'
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  inline: {
    display: 'inline'
  }
}))

const GetMessages = ({ firebase }) => {
  const classes = useStyles()
  const { setSnackbarState } = useContext(SnackbarContext)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const userId = useSelector(state => state.user.userId)

  const onRemoveMessage = uid => {
    firebase.message(uid).remove()
    setSnackbarState({ message: 'Message was deleted!', variant: 'success' })
  }

  const onEditMessage = uid => {
    console.log(uid)
    setSnackbarState({ message: 'Message was deleted!', variant: 'success' })
  }

  useEffect(() => {
    setLoading(true)
    const unsubscribe = firebase
      .messages(userId)
      .orderByChild('userId')
      .equalTo(userId)
      .on(
        'value',
        snapshot => {
          const messagesObject = snapshot.val()
          if (messagesObject) {
            setMessages(
              Object.keys(messagesObject).map(key => ({
                ...messagesObject[key],
                uid: key
              }))
            )

            setLoading(false)
          } else {
            setMessages([])
            setLoading(false)
          }
        },
        err => {
          setSnackbarState({ message: err, variant: 'error' })
        }
      )

    return () => unsubscribe
  }, [userId, firebase, setSnackbarState])

  return (
    <div>
      <Formik
        initialValues={{ message: '' }}
        validationSchema={MessageScheme}
        onSubmit={(values, { setSubmitting, resetForm, initialValues }) => {
          const { message } = values

          try {
            firebase.messages().push({
              text: message,
              userId,
              createdDate: Date()
            })
            setSubmitting(false)
            resetForm(initialValues)
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
        {({ isSubmitting }) => (
          <Form>
            <Field
              type="text"
              name="message"
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
              disabled={isSubmitting}
              aria-label="add"
              className={classes.fab}
            >
              <AddIcon />
            </Fab>
          </Form>
        )}
      </Formik>
      {loading && <CircularProgress className="messageLoading" />}

      <List className={classes.root}>
        {messages.map((message, index) => (
          <div key={message.uid}>
            <ListItem alignItems="flex-start">
              <ListItemText primary="Message" secondary={message.text} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => onEditMessage(message)}
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

            {messages.length !== index + 1 && <Divider component="li" />}
          </div>
        ))}
      </List>
    </div>
  )
}

export default compose(withFirebase)(GetMessages)
