export enum ImageResizeFitType {
  /**
   * An image resize processing parameter.
   * For more information 'sharp' documents 
   * https://sharp.pixelplumbing.com/api-resize
   */
  cover = 'cover',
  contain = 'contain',
  fill = 'fill',
  inside = 'inside',
  outside = 'outside',
}

export const uploadMultiToS3AliAbi = async (files: FileList, folder: string,
  fit: ImageResizeFitType = ImageResizeFitType.cover,
  token: string,
  tags: string) =>
  new Promise<any>(async (resolve, reject) => {
    if (!files || files.length == 0) {
      return reject('Please select a file to upload.')
    }

    console.log('folder:', folder)
    var i = 0
    const formData = new FormData()


    while (i < files.length) {
      formData.append('file', files.item(i) as File)
      i++
    }


    formData.append('folder', folder)
    formData.append('fit', fit.toString())
    formData.append('tags', tags.toString())

    postFilesToBackend(formData, '/s3/imageUpload', token).then(resolve).catch(reject)
  })

export const uploadSingleToS3AliAbi = async (file: File, folder: string,
  fit: ImageResizeFitType = ImageResizeFitType.cover,
  token: string,
  tags: string,
  ) =>
  new Promise<any>(async (resolve, reject) => {
    if (!file) {
      return reject('Please select a file to upload.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('fit', fit.toString())

    postFilesToBackend(formData, '/s3/imageUpload', token).then(resolve).catch(reject)

  })


export const mdxImageUploadToS3AliAbi = async (file: File, folder: string, fit: ImageResizeFitType = ImageResizeFitType.cover, token: string) =>
  new Promise<any>(async (resolve, reject) => {
    if (!file) {
      return reject('Please select a file to upload.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('fit', fit.toString())

    postFilesToBackend(formData, '/s3/mdxImageUpload', token).then(resolve).catch(reject)

  })

function postFilesToBackend(formData: FormData, apiPath: string, token: string) {
  return new Promise<any>((resolve, reject) => {
    const url = process.env.NEXT_PUBLIC_API_URI + (apiPath || '/s3/imageUpload')
    fetch(url, {
      method: 'POST',
      headers: { token: token },
      body: formData,
    }).then(uploadResponse => {
      if (uploadResponse.ok) {
        uploadResponse.json()
          .then(result => {
           
            if (result.success) {

              resolve(result.data)
            } else {
              reject(result.error)
            }
          })
          .catch(err => reject(err.message || err))

      } else {
        reject(uploadResponse.statusText)
      }
    })
      .catch(err => reject(err.message || err))
  })
}

