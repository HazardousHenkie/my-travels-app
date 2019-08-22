import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'

import { compose } from 'recompose'

import CircularProgress from '@material-ui/core/CircularProgress'

import ImageUpload from '../ImageUpload'

import { withFirebase } from '../Firebase'

import SnackbarContext from '../Snackbar/Context'

const GetMessages = ({ firebase }) => {
  const { setSnackbarState } = useContext(SnackbarContext)
  const [text, setText] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const userId = useSelector(state => state.user.userId)

  const onChangeText = event => {
    setText(event.target.value)
  }

  const onCreateMessage = async event => {
    event.preventDefault()

    try {
      await firebase.messages().push({
        text,
        userId
      })

      setText('')
      setSnackbarState({ message: 'Message was created!', variant: 'success' })
    } catch (error) {
      setSnackbarState({ message: error, variant: 'error' })
      setErrorMessage({ error })
    }
  }

  const onRemoveMessage = uid => {
    firebase.message(uid).remove()
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
          setErrorMessage(err)
        }
      )

    return () => unsubscribe
  }, [userId, firebase, setSnackbarState])

  return (
    <div>
      {loading && <CircularProgress className="messageLoading" />}

      {errorMessage}

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

      <form onSubmit={onCreateMessage}>
        <input type="text" value={text} onChange={onChangeText} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default compose(withFirebase)(GetMessages)
