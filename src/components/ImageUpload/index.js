import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import shortid from 'shortid'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import { withFirebase } from '../Firebase'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

// todo for now this is fine but we can't really re-use this component since we can only save one image which is linked to one user make it so it can be re-used more. Everything is done is this component only
const ImageUpload = ({ firebase }) => {
  const [files, setFiles] = useState([])
  const [uploadedFile, setUploadedFile] = useState('')
  const userId = useSelector(state => state.user.userId)

  useEffect(
    () => {
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
      return () => unsubscribe
    },
    [firebase, userId]
  )

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
                error(err.message)
                abort()
              },
              () => {
                try {
                  uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    firebase
                      .imagesUser()
                      .child(userId)
                      .set({
                        downloadURL
                      })

                    setUploadedFile(downloadURL)
                  })
                } catch (userError) {
                  error(userError)
                }

                load()
              }
            )
          },
          load: (source, load, error, progress, abort) => {
            progress(true, 0, 1024)

            let xhr = new XMLHttpRequest()
            xhr.responseType = 'blob'
            xhr.onload = function () {
              let blob = xhr.response
              load(blob)
            }
            xhr.open('GET', source)
            xhr.send()
          },
          revert: (uniqueFileId, load, error) => {
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
                error(removeError)
              })
          }
        }}
      />
    </div>
  )
}

export default withFirebase(ImageUpload)
