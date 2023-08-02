import { API_SERVICE } from '../../../services'
import { HandleAxiosError, UploadImage } from '../../../utilities.js'

export const FetchPromotions = async ({
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/promotions`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')
        setInitialValues({
          dvmPhotoOne: response.data.dvm?.[0] || '',
          dvmPhotoTwo: response.data.dvm?.[1] || '',
          dvmPhotoThree: response.data.dvm?.[2] || '',
          dvmPhotoFour: response.data.dvm?.[3] || '',
          dvmPhotoFive: response.data.dvm?.[4] || '',
          consumerPhotoOne: response.data.consumer?.[0] || '',
          consumerPhotoTwo: response.data.consumer?.[1] || '',
          consumerPhotoThree: response.data.consumer?.[2] || '',
          consumerPhotoFour: response.data.consumer?.[3] || '',
          consumerPhotoFive: response.data.consumer?.[4] || '',

          dvmPhotoOne__: response.data.dvm?.[0] || '',
          dvmPhotoTwo__: response.data.dvm?.[1] || '',
          dvmPhotoThree__: response.data.dvm?.[2] || '',
          dvmPhotoFour__: response.data.dvm?.[3] || '',
          dvmPhotoFive__: response.data.dvm?.[4] || '',
          consumerPhotoOne__: response.data.consumer?.[0] || '',
          consumerPhotoTwo__: response.data.consumer?.[1] || '',
          consumerPhotoThree__: response.data.consumer?.[2] || '',
          consumerPhotoFour__: response.data.consumer?.[3] || '',
          consumerPhotoFive__: response.data.consumer?.[4] || '',
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const SubmitPromotions = async ({
  navigate,
  values,
  setIsLoading,
  setError,
  setLoadingMessage,
  formik
}) => {
  setIsLoading(true)
  setLoadingMessage('Please wait...')

  const endpoint = `/promotions`
  const payload = {
    dvm: [],
    consumer: [],
  }

  if (values?.dvmPhotoOne?.startsWith('data')) {
    setLoadingMessage('Uploading DVM Photo One...')
    const url = await UploadImage(values.dvmPhotoOne, values.dvmPhotoOne__)
    payload.dvm.push(url)
  } else {
    payload.dvm.push(values.dvmPhotoOne || '')
  }

  if (values?.dvmPhotoTwo?.startsWith('data')) {
    setLoadingMessage('Uploading DVM Photo Two...')
    const url = await UploadImage(values.dvmPhotoTwo, values.dvmPhotoTwo__)
    payload.dvm.push(url)
  } else {
    payload.dvm.push(values.dvmPhotoTwo || '')
  }

  if (values?.dvmPhotoThree?.startsWith('data')) {
    setLoadingMessage('Uploading DVM Photo Three...')
    const url = await UploadImage(values.dvmPhotoThree, values.dvmPhotoThree__)
    payload.dvm.push(url)
  } else {
    payload.dvm.push(values.dvmPhotoThree || '')
  }

  if (values?.dvmPhotoFour?.startsWith('data')) {
    setLoadingMessage('Uploading DVM Photo Four...')
    const url = await UploadImage(values.dvmPhotoFour, values.dvmPhotoFour__)
    payload.dvm.push(url)
  } else {
    payload.dvm.push(values.dvmPhotoFour || '')
  }

  if (values?.dvmPhotoFive?.startsWith('data')) {
    setLoadingMessage('Uploading DVM Photo Five...')
    const url = await UploadImage(values.dvmPhotoFive, values.dvmPhotoFive__)
    payload.dvm.push(url)
  } else {
    payload.dvm.push(values.dvmPhotoFive || '')
  }

  if (values?.consumerPhotoOne?.startsWith('data')) {
    setLoadingMessage('Uploading Consumer Photo One...')
    const url = await UploadImage(values.consumerPhotoOne, values.consumerPhotoOne__)
    payload.consumer.push(url)
  } else {
    payload.consumer.push(values.consumerPhotoOne || '')
  }

  if (values?.consumerPhotoTwo?.startsWith('data')) {
    setLoadingMessage('Uploading Consumer Photo Two...')
    const url = await UploadImage(values.consumerPhotoTwo, values.consumerPhotoTwo__)
    payload.consumer.push(url)
  } else {
    payload.consumer.push(values.consumerPhotoTwo || '')
  }

  if (values?.consumerPhotoThree?.startsWith('data')) {
    setLoadingMessage('Uploading Consumer Photo Three...')
    const url = await UploadImage(values.consumerPhotoThree, values.consumerPhotoThree__)
    payload.consumer.push(url)
  } else {
    payload.consumer.push(values.consumerPhotoThree || '')
  }

  if (values?.consumerPhotoFour?.startsWith('data')) {
    setLoadingMessage('Uploading Consumer Photo Four...')
    const url = await UploadImage(values.consumerPhotoFour, values.consumerPhotoFour__)
    payload.consumer.push(url)
  } else {
    payload.consumer.push(values.consumerPhotoFour || '')
  }

  if (values?.consumerPhotoFive?.startsWith('data')) {
    setLoadingMessage('Uploading Consumer Photo Five...')
    const url = await UploadImage(values.consumerPhotoFive, values.consumerPhotoFive__)
    payload.consumer.push(url)
  } else {
    payload.consumer.push(values.consumerPhotoFive || '')
  }

  const HandleEditMode = async () => {
    setLoadingMessage('Saving Promotions...')

    await API_SERVICE()
      .post(endpoint, JSON.stringify(payload))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/Promotions', {
            state: {
              message: 'Promotions Updated Successfully!',
            },
            replace: true,
          })
          setLoadingMessage('')
          setIsLoading(false)
        } else {
          setLoadingMessage('')
          setIsLoading(false)
          setError(`${response.status} - ${response.statusText}`)
        }
      }).catch(error => {
        setLoadingMessage('')
        setIsLoading(false)
        HandleAxiosError({ error, setError, navigate })
      })
  }

  await HandleEditMode()
}