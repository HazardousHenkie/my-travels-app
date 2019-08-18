import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import shortid from 'shortid'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import { withFirebase } from '../Firebase'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const ImageUpload = ({ firebase }) => {
  const [files, setFiles] = useState([])
  const [uploadedFile, setUploadedFile] = useState('')
  const userId = useSelector(state => state.user.userId)

  firebase
    .imagesUser()
    .child(userId)
    .once('value', snapshot => {
      if (snapshot.val() !== null) {
        // TODO infinite loop fix
        // setFiles([
        //   {
        //     source: snapshot.val().downloadURL,
        //     options: {
        //       type: 'local'
        //     }
        //   }
        // ])
      }
    })

  return (
    <div className="imageUpload">
      <FilePond
        files={files}
        allowMultiple={false}
        maxFiles={1}
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

                    // const xhr = new XMLHttpRequest()
                    // xhr.responseType = 'blob'
                    // xhr.onload = () => {
                    //   const blob = xhr.response
                    //   load(blob)
                    //   setFiles(blob)
                    // }
                    // xhr.open('GET', downloadURL)
                    // xhr.send()

                    // console.log(downloadURL)
                  })
                } catch (userError) {
                  error(userError)
                }

                load()
              }
            )
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
