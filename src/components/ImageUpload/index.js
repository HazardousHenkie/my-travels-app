import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import shortid from 'shortid'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import { withFirebase } from '../Firebase'
import SnackbarContext from '../Snackbar/Context'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const ImageUpload = ({ firebase }) => {
  const [files, setFiles] = useState([])
  const [uploadedFile, setUploadedFile] = useState('')
  const userId = useSelector(state => state.user.userId)
  const { setSnackbarState } = useContext(SnackbarContext)

  useEffect(() => {
    const unsubscribe = firebase
      .imagesUser()
      .child(userId)
      .once('value', snapshot => {
        if (snapshot.val() !== null) {
          setFiles([
            {
              source: snapshot.val().downloadURL,
              options: {
                type: 'local'
              }
            }
          ])

          setUploadedFile(snapshot.val().downloadURL)
        }
      })
      .catch(removeError => {
        setSnackbarState({ message: removeError, variant: 'error' })
      })

    return () => unsubscribe
  }, [firebase, userId, setSnackbarState])

  return (
    <div className="imageUpload">
      <FilePond
        files={files}
        allowMultiple={false}
        maxFiles={1}
        onupdatefiles={fileItems => {
          setFiles(fileItems.map(fileItem => fileItem.file))
        }}
        server={{
          process: (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort
          ) => {
            const id = shortid.generate()
            const uploadTask = firebase
              .getStorage()
              .child(`images/${id}`)
              .put(file)

            uploadTask.on(
              firebase.firebase().storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                progress(true, snapshot.bytesTransferred, snapshot.totalBytes)
              },
              err => {
                setSnackbarState({ message: err.message, variant: 'error' })
                abort()
              },
              () => {
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then(downloadURL => {
                    firebase
                      .imagesUser()
                      .child(userId)
                      .set({
                        downloadURL
                      })

                    setUploadedFile(downloadURL)
                    setSnackbarState({
                      message: 'Image uploaded!',
                      variant: 'success'
                    })
                  })
                  .catch(userError => {
                    setSnackbarState({ message: userError, variant: 'error' })
                  })

                load()
              }
            )
          },
          load: (source, load, error, progress) => {
            progress(true, 0, 1024)

            const xhr = new XMLHttpRequest()
            xhr.responseType = 'blob'
            xhr.onload = () => {
              const blob = xhr.response
              load(blob)
            }
            xhr.open('GET', source)
            xhr.send()
          },
          revert: (uniqueFileId, load) => {
            const imageRef = firebase
              .firebase()
              .storage()
              .refFromURL(uploadedFile)

            imageRef
              .delete()
              .then(() => {
                firebase
                  .imagesUser()
                  .child(userId)
                  .remove()

                load()
              })
              .catch(removeError => {
                setSnackbarState({ message: removeError, variant: 'error' })
              })
          }
        }}
      />
    </div>
  )
}

export default withFirebase(ImageUpload)
