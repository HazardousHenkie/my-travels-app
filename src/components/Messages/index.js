import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import moment from 'moment'
import { withFirebase } from '../Firebase'
import SnackbarContext from '../Snackbar/Context'
import MessageListItem from './MessageListItem'

const MessageScheme = Yup.object().shape({
  message: Yup.string().required('Required')
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
            const sortedMessages = Object.keys(messagesObject).map(key => ({
              text: messagesObject[key].text,
              date2: messagesObject[key].createdDate,
              date: moment(messagesObject[key].createdDate).format(
                'MM/DD/YYYY'
              ),
              uid: key
            }))

            sortedMessages.sort((a, b) => {
              const dateA = new Date(a.date2)
              const dateB = new Date(b.date2)

              return dateB - dateA
            })

            setMessages(sortedMessages)

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
              createdDate: firebase.firebase().database.ServerValue.TIMESTAMP
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
            <MessageListItem message={message} />

            {messages.length !== index + 1 && <Divider component="li" />}
          </div>
        ))}
      </List>
    </div>
  )
}

export default withFirebase(GetMessages)
