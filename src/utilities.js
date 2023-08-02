import { Timestamp } from 'firebase/firestore'
import moment from 'moment'
import FileResizer from 'react-image-file-resizer'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { Storage } from './config/firebase'

export const UpperCaseFirstLetter = (data) => {
  return data.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join(' ')
}

export const HandleAxiosError = ({
  error,
  setError,
  navigate,
}) => {
  if (error?.code === 'ERR_NETWORK') {
    setError(`${error?.code}`)
  } else if (error?.response?.status === 401) {
    const userData = localStorage.getItem('userData')
    if (userData) localStorage.clear()
    navigate('/Admin/Login')
  } else if (Array.isArray(error.response?.data?.message)) {
    setError(error.response?.data?.message.map(error => {
      return `${error.response?.status} - ${error || error.response?.statusText}`
    }))
  } else {
    setError(`${error.response?.status} - ${error.response?.data?.message || error.response?.statusText}`)
  }
}

export const FormatTimestamp = (timestamp) => {
  return moment(
    new Timestamp(
      timestamp._seconds,
      timestamp._nanoseconds
    ).toDate()
  ).utc().local().format('hh:mm A, DD-MMM-YYYY')
}

export const ConvertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => resolve(fileReader.result)
    fileReader.onerror = (error) => reject(error)
  })
}

export const ResizeFile = (file, width, height, quality) => new Promise(resolve => {
  FileResizer.imageFileResizer(file, width, height, 'JPEG', quality, 0,
    uri => {
      resolve(uri)
    }, 'base64')
})

export const UploadImage = async (image, uploadedImage) => {
  if ((image.startsWith('data') && uploadedImage.startsWith('http')) || (!image && uploadedImage.startsWith('http'))) {
    const imageRef = ref(Storage, uploadedImage.split('.com/o/')[1].split('?')[0])
    await deleteObject(imageRef)
  }

  if (image.startsWith('data')) {
    const imageBlob = await (await fetch(image)).blob()
    const reference = ref(Storage, `${uuidv4()}`)
    const uploadResponse = await uploadBytes(reference, imageBlob)
    const url = await getDownloadURL(uploadResponse.ref)
    return url
  }

  return ''
}