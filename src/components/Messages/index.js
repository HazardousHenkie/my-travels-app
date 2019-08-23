import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { compose } from 'recompose'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import ImageUpload from '../ImageUpload'
import { withFirebase } from '../Firebase'
import SnackbarContext from '../Snackbar/Context'

const MessageScheme = Yup.object().shape({
  message: Yup.string().required('Required')
})

const GetMessages = ({ firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const userId = useSelector(state => state.user.userId)

  const onRemoveMessage = uid => {
    firebase.message(uid).remove()
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
      {loading && <CircularProgress className="messageLoading" />}

      <ImageUpload />

      <ul>
        {messages.map(message => (
          <li key={message.uid}>
            <strong>{message.userId}</strong>
            {message.text}

            <button type="button" onClick={() => onRemoveMessage(message.uid)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <Formik
        initialValues={{ message: '' }}
        validationSchema={MessageScheme}
        onSubmit={(values, { setSubmitting }) => {
          const { message } = values

          try {
            firebase.messages().push({
              text: message,
              userId
            })
            setSubmitting(false)
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
            <Field type="text" name="message" component={TextField} />
            <ErrorMessage name="message" component="span" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default compose(withFirebase)(GetMessages)
