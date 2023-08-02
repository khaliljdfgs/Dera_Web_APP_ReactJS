import { API_SERVICE } from '../../../services'
import { HandleAxiosError, UploadImage } from '../../../utilities.js'

export const SendPushNotification = async ({
  navigate,
  values,
  setIsLoading,
  setError,
  setLoadingMessage,
  formik,
}) => {
  setIsLoading(true)
  setLoadingMessage('Please wait...')

  const endpoint = `/pushNotifications`
  const payload = {
    title: `${values.title}`.trim(),
    content: `${values.content}`.trim(),
    accountType: values.accountType.value,
    readMore: `${values.readMore || ''}`.trim(),
    photo: ''
  }

  if (values?.notificationPhoto?.startsWith('data')) {
    setLoadingMessage('Uploading Photo...')
    const url = await UploadImage(values.notificationPhoto, values.notificationPhoto__)
    payload.photo = url
  } else {
    payload.photo = values.notificationPhoto || ''
  }

  const HandleSend = async () => {
    setLoadingMessage('Sending Push Notification...')

    await API_SERVICE()
      .post(endpoint, JSON.stringify(payload))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/PushNotifications', {
            state: {
              message: 'Push Notification Sent Successfully!',
            },
            replace: true,
          })
          formik.resetForm(formik.initialValues)
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

  await HandleSend()
}