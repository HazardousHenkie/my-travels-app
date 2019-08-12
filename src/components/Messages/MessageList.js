import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import Firebase from '../Firebase/Firebase'

const onRemoveMessage = uid => {
  Firebase.message(uid).remove()
}

const GetMessages = () => {
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
      await Firebase.messages().push({
        text,
        userId
      })

      setText('')
    } catch (error) {
      setErrorMessage({ error })
    }
  }

  // only get from specific user id
  useEffect(() => {
    setLoading(true)
    const unsubscribe = Firebase.messages(userId)
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
          setErrorMessage(err)
        }
      )

    return () => unsubscribe
  }, [userId])

  return (
    <div>
      {loading && <CircularProgress className="messageLoading" />}

      {errorMessage}

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

export default GetMessages
